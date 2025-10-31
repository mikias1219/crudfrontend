'use client'
import React, { useState } from "react";

export default function ArtistCard({ onClose }: { onClose: () => void }) {
    const [audioFile, setAudioFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAudioFile(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setAudioFile(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!audioFile) {
            alert('Please upload an audio file');
            return;
        }
        console.log('Artist created with file:', audioFile);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-w-md">
            <h2 className="text-xl font-bold">Add Artist</h2>

            <div>
                <label className="block mb-2">Song Title</label>
                <input type="text" required className="w-full p-2 border rounded" />
            </div>

            <div>
                <label className="block mb-2">Audio File</label>
                <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="w-full"
                />
                <p className="text-sm text-gray-600">
                    {audioFile ? 'File selected' : 'Upload a song file'}
                </p>
            </div>

            {audioFile && (
                <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
                    <span className="text-sm">{audioFile.name}</span>
                    <button type="button" onClick={removeFile} className="text-red-500">×</button>
                </div>
            )}

            <div className="flex gap-2">
                <button type="button" onClick={onClose} className="flex-1 p-2 border rounded">Cancel</button>
                <button 
                    type="submit" 
                    disabled={!audioFile}
                    className="flex-1 p-2 bg-amber-500 text-white rounded disabled:bg-gray-300"
                >
                    Add Artist
                </button>
            </div>
        </form>
    );
}