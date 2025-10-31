'use client'
import React, { useState, useEffect } from "react";
import { songAPI } from "@/lib/songapi";

interface Song {
    Songs_id: number;
    Songs_name: string;
    Gener: string;
}

interface SongCardProps {
    onClose: () => void;
    editingSong?: Song | null;
    onSuccess?: () => void;
}

export default function SongCard({ onClose, editingSong, onSuccess }: SongCardProps) {
    const [songName, setSongName] = useState("");
    const [gener, setGener] = useState("");
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // Populate form when editing
    useEffect(() => {
        if (editingSong) {
            setSongName(editingSong.Songs_name);
            setGener(editingSong.Gener);
        } else {
            setSongName("");
            setGener("");
            setAudioFile(null);
        }
    }, [editingSong]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAudioFile(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setAudioFile(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!songName || !gener) {
            alert('Please fill all required fields');
            return;
        }

        // Audio file is optional for updates, but recommended
        if (!editingSong && !audioFile) {
            if (!confirm('No audio file selected. Create song without audio?')) {
                return;
            }
        }

        try {
            setUploading(true);

            if (editingSong) {
                // Update existing song
                await songAPI.update(editingSong.Songs_id, {
                    Songs_name: songName,
                    Gener: gener,
                    audioFile: audioFile ?? undefined,
                });
                alert('Song updated successfully');
            } else {
                // Create new song
                await songAPI.create({
                    Songs_name: songName,
                    Gener: gener,
                    audioFile: audioFile ?? undefined,
                });
                alert('Song created successfully');
            }

            if (onSuccess) {
                onSuccess();
            } else {
                onClose();
            }
        } catch (error) {
            console.error('Error saving song:', error);
            alert(`Failed to ${editingSong ? 'update' : 'create'} song`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
                <label className="block mb-2 font-medium">Song Name *</label>
                <input
                    type="text"
                    value={songName}
                    onChange={(e) => setSongName(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                    placeholder="Enter song name"
                />
            </div>
            <div>
                <label className="block mb-2 font-medium">Genre *</label>
                <input
                    type="text"
                    value={gener}
                    onChange={(e) => setGener(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                    placeholder="Enter genre"
                />
            </div>
            <div>
                <label className="block mb-2 font-medium">
                    Audio File {!editingSong && '(optional)'}
                </label>
                <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded"
                />
                <p className="text-sm text-gray-600 mt-1">
                    {audioFile ? `Selected: ${audioFile.name}` : 'No file selected'}
                </p>
            </div>

            {audioFile && (
                <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
                    <span className="text-sm">{audioFile.name}</span>
                    <button
                        type="button"
                        onClick={removeFile}
                        className="text-red-500 hover:text-red-700"
                    >
                        × Remove
                    </button>
                </div>
            )}

            <div className="flex gap-2 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={uploading}
                    className="flex-1 p-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={uploading || !songName || !gener}
                    className="flex-1 p-2 bg-amber-500 text-white rounded hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {uploading ? 'Saving...' : editingSong ? 'Update Song' : 'Create Song'}
                </button>
            </div>
        </form>
    );
}