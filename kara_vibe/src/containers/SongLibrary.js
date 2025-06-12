import React, { useState, useMemo } from "react";
import SongList from "../components/SongList";
import SearchBar from "../components/SearchBar";
import songsData from "../assets/songs.json";
import { useNavigate } from "react-router-dom";
// Ensure there is no usage of PUBLIC_URL here.

/**
 * PUBLIC_INTERFACE
 * SongLibrary displays a searchable, filterable list of karaoke tracks.
 */
function SongLibrary() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Filter songs by search query (title or artist, case-insensitive)
  const filteredSongs = useMemo(() => {
    const q = search.toLowerCase();
    return songsData.filter(
      song =>
        song.title.toLowerCase().includes(q) ||
        song.artist.toLowerCase().includes(q)
    );
  }, [search]);

  // Handler when a song is selected
  const handleSongSelect = (song) => {
    // Navigate to the recording screen for now (placeholder route)
    // In a complete app, would pass song ID or data
    navigate(`/record/${song.id}`);
  };

  return (
    <div style={{ marginTop: 24 }}>
      <h1 className="title" style={{ fontSize: "2.2rem" }}>Song Library</h1>
      <div style={{ margin: "24px 0" }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by song or artist..." />
      </div>
      <SongList songs={filteredSongs} onSongSelect={handleSongSelect} />
      {filteredSongs.length === 0 && (
        <div style={{ color: "var(--text-secondary)", textAlign: "center", marginTop: 32 }}>
          No songs found.
        </div>
      )}
    </div>
  );
}

export default SongLibrary;
