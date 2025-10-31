'use client'
import React, { useState, useEffect, useCallback } from "react";
import { albumAPI } from "@/lib/albumapi";

interface Album {
  Album_id: number;
  Album_title: string;
  Total_tracks: number;
  audio_url?: string;
}

export default function Album() {
  const [showCard, setShowCard] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);

  const [title, setTitle] = useState("");
  const [tracks, setTracks] = useState(1);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchAlbums = useCallback(async () => {
    try {
      setLoading(true);
      const data = await albumAPI.getAll();
      setAlbums(data);
    } catch (error) {
      console.error("Error fetching albums:", error);
      alert("Failed to fetch albums");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const handleDeleteAlbum = async (Album_id: number) => {
    if (!confirm("Are you sure you want to delete this album?")) return;
    try {
      await albumAPI.delete(Album_id);
      alert("Album deleted successfully");
      fetchAlbums();
    } catch (error) {
      console.error("Error deleting album:", error);
      alert("Failed to delete album");
    }
  };

  const handleAddClick = () => {
    setEditingAlbum(null);
    setTitle("");
    setTracks(1);
    setAudioFile(null);
    setShowCard(true);
  };

  const handleEditAlbum = (album: Album) => {
    setEditingAlbum(album);
    setTitle(album.Album_title);
    setTracks(album.Total_tracks);
    setShowCard(true);
  };

  const handleCloseCard = () => {
    setShowCard(false);
    setEditingAlbum(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !tracks) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setUploading(true);

      if (editingAlbum) {
        await albumAPI.update(editingAlbum.Album_id, {
          Album_title: title,
          Total_tracks: tracks,
          audioFile: audioFile ?? undefined,
        });
        alert("Album updated successfully");
      } else {
        await albumAPI.create({
          Album_title: title,
          Total_tracks: tracks,
          audioFile: audioFile ?? undefined,
        });
        alert("Album created successfully");
      }

      fetchAlbums();
      handleCloseCard();
    } catch (err) {
      console.error(err);
      alert("Failed to create album");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      {showCard ? (
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-amber-500 px-8 py-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {editingAlbum ? "Edit Album" : "New Album"}
            </h2>
            <button
              onClick={handleCloseCard}
              className="ml-auto text-white text-2xl hover:text-amber-200"
            >
              ×
            </button>
          </div>
          <form className="p-4" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block font-medium">Album Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-3">
              <label className="block font-medium">Total Tracks</label>
              <input
                type="number"
                value={isNaN(tracks) ? '' : tracks}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setTracks(1);
                  } else {
                    const numValue = parseInt(value, 10);
                    setTracks(isNaN(numValue) ? 1 : numValue);
                  }
                }}
                min="1"
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-3">
              <label className="block font-medium">Audio File</label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) =>
                  setAudioFile(e.target.files ? e.target.files[0] : null)
                }
                className="w-full"
              />
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {uploading ? "Uploading..." : editingAlbum ? "Update Album" : "Create Album"}
            </button>
          </form>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mt-4 mb-4">
            <h1 className="text-2xl font-bold">Albums</h1>
            <button
              onClick={handleAddClick}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              + Add Album
            </button>
          </div>

          {loading ? (
            <p className="text-center">Loading albums...</p>
          ) : albums.length === 0 ? (
            <p className="text-center text-gray-500">No albums found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {albums.map((album) => (
                <div key={album.Album_id} className="border p-4 rounded shadow bg-white">
                  <h3 className="text-lg font-semibold">{album.Album_title}</h3>
                  <p className="text-gray-600">Tracks: {album.Total_tracks}</p>
                  {album.audio_url && (
                    <audio controls className="w-full mt-2">
                      <source src={`http://127.0.0.1:8002${album.audio_url}`} />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleEditAlbum(album)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAlbum(album.Album_id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
