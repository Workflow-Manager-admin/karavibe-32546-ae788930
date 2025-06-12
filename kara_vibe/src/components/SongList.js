import React from "react";
import SongCard from "./SongCard";

/**
 * PUBLIC_INTERFACE
 * SongList renders a list of SongCard components.
 * @param {Array} songs - List of song objects.
 * @param {Function} onSongSelect - Callback when a song is selected.
 */
function SongList({ songs, onSongSelect }) {
  // Ensure no accidental use of PUBLIC_URL
  // No usage of PUBLIC_URL here; placeholder comment for troubleshooting context.
  // If you need to refer to the public folder, use process.env.PUBLIC_URL in JS/JSX,
  // or %PUBLIC_URL% in HTML templates.

  if (!songs || songs.length === 0) return null;
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: "24px"
    }}>
      {songs.map(song => (
        <SongCard key={song.id} song={song} onSelect={() => onSongSelect(song)} />
      ))}
    </div>
  );
}

export default SongList;
