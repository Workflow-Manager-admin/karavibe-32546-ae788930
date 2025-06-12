import React from "react";

/**
 * PUBLIC_INTERFACE
 * SongCard displays the info and select action for a song.
 * @param {Object} song - Song object to render.
 * @param {Function} onSelect - Handler for selection.
 */
function SongCard({ song, onSelect }) {
  return (
    <div style={{
      border: "1px solid var(--border-color)",
      borderRadius: 8,
      background: "rgba(30,30,40,0.85)",
      boxShadow: "0 4px 16px #0002",
      padding: 20,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      transition: "box-shadow 0.2s",
      minHeight: 170
    }}>
      <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>{song.title}</div>
      <div style={{ color: "var(--text-secondary)", margin: "6px 0 10px" }}>{song.artist}</div>
      <div style={{
        fontSize: 12,
        color: "var(--accent)",
        marginBottom: 14
      }}>
        {song.genre} • {song.year}
      </div>
      <button
        className="btn"
        style={{
          marginTop: "auto",
          background: "var(--primary)"
        }}
        onClick={onSelect}
      >
        Sing / Record
      </button>
    </div>
  );
}

export default SongCard;
