// import React, { useState } from "react";
// import { albumAPI } from "@/lib/albumapi";

// interface AlbumFormProps {
//   editingAlbum?: any;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// export default function AlbumFormCard({ editingAlbum, onClose, onSuccess }: AlbumFormProps) {
//   const [albumTitle, setAlbumTitle] = useState(editingAlbum?.Album_title || "");
//   const [totalTracks, setTotalTracks] = useState(editingAlbum?.Total_tracks || 0);
//   const [audioFile, setAudioFile] = useState<File | null>(null); // New state for audio
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (editingAlbum) {
//         // Update album with optional audio
//         await albumAPI.update(editingAlbum.Album_id, {
//           Album_title: albumTitle,
//           Total_tracks: totalTracks,
//           audioFile: audioFile || undefined, // Only send if selected
//         });
//         alert("✅ Album updated successfully!");
//       } else {
//         // Create new album with optional audio
//         await albumAPI.create({
//           Album_title: albumTitle,
//           Total_tracks: totalTracks,
//           audioFile: audioFile || undefined,
//         });
//         alert("✅ Album created successfully!");
//       }

//       onSuccess();
//     } catch (err) {
//       console.error("Error:", err);
//       alert("❌ Failed to save album");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-6 space-y-4">
//       <div>
//         <label className="block text-gray-700 mb-1">Album Title</label>
//         <input
//           type="text"
//           value={albumTitle}
//           onChange={(e) => setAlbumTitle(e.target.value)}
//           className="border border-gray-300 rounded-md p-2 w-full"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-gray-700 mb-1">Total Tracks</label>
//         <input
//           type="number"
//           value={totalTracks}
//           onChange={(e) => setTotalTracks(Number(e.target.value))}
//           className="border border-gray-300 rounded-md p-2 w-full"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-gray-700 mb-1">Audio File</label>
//         <input
//           type="file"
//           accept=".mp3,.wav,.ogg"
//           onChange={(e) => {
//             if (e.target.files && e.target.files[0]) {
//               setAudioFile(e.target.files[0]);
//             }
//           }}
//           className="border border-gray-300 rounded-md p-2 w-full"
//         />
//         {audioFile && (
//           <p className="mt-1 text-sm text-gray-600">Selected file: {audioFile.name}</p>
//         )}
//       </div>

//       <div className="flex justify-end gap-2">
//         <button
//           type="button"
//           onClick={onClose}
//           className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600"
//         >
//           {loading ? "Saving..." : editingAlbum ? "Update" : "Create"}
//         </button>
//       </div>
//     </form>
//   );
// }
