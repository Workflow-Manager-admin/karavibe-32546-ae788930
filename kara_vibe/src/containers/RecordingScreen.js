import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import songsData from "../assets/songs.json";

/**
 * PUBLIC_INTERFACE
 * RecordingScreen container – allows user to play instrumental, see (placeholder) synced lyrics,
 * record vocals, and select voice filters (placeholder). Receives songId via route param.
 */
function RecordingScreen() {
  const { songId } = useParams();
  const navigate = useNavigate();

  // Find the selected song data
  const song = songsData.find((s) => String(s.id) === String(songId));

  if (!song) {
    // If invalid songId, navigate back or show fallback
    return (
      <div style={{ marginTop: 40, textAlign: "center" }}>
        <div className="title" style={{ fontSize: "2rem" }}>Song Not Found</div>
        <div style={{ color: "var(--text-secondary)", marginTop: 10 }}>
          The requested song does not exist.<br />
          <button
            className="btn"
            style={{ marginTop: 16, background: "var(--primary)" }}
            onClick={() => navigate("/songs")}
          >
            Back to Songs
          </button>
        </div>
      </div>
    );
  }

  // UI scaffold – replace logic with real audio/lyrics features in future upgrades
  return (
    <div style={{ paddingTop: 24, paddingBottom: 48 }}>
      {/* Song & Title section */}
      <div style={{ marginBottom: 10 }}>
        <button className="btn" style={{ marginBottom: 18 }} onClick={() => navigate("/songs")}>
          ← Back to Song Library
        </button>
        <h1 className="title" style={{ fontSize: "2rem" }}>
          {song.title}
        </h1>
        <div style={{ color: "var(--text-secondary)", marginBottom: 8 }}>{song.artist}</div>
      </div>
      {/* Instrumental Playback Area */}
      <div
        style={{
          border: "1px solid var(--border-color)",
          borderRadius: 10,
          background: "rgba(25,25,25,0.82)",
          padding: 24,
          marginBottom: 28,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        {/* Placeholder Audio Player */}
        <div style={{ width: "100%", maxWidth: 330, textAlign: "center" }}>
          <div style={{
            color: "var(--accent)",
            fontWeight: 500,
            marginBottom: 9,
            fontSize: "1.15rem"
          }}>
            Instrumental Track
          </div>
          {/* Placeholder for <audio> element – real audio integration in the future */}
          <div style={{
            display: "inline-block",
            padding: "16px 32px",
            borderRadius: 8,
            background: "#232535",
            color: "var(--text-secondary)",
            fontWeight: 400,
            marginBottom: 8,
            border: "1px solid var(--border-color)"
          }}>
            [Audio Player will go here]
          </div>
        </div>
        {/* Synced Lyrics Display (Placeholder) */}
        <div style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 6,
          background: "#191a22",
          border: "1px solid var(--border-color)",
          padding: "18px 20px",
          color: "var(--text-color)",
          textAlign: "center"
        }}>
          {/* Future: Render synced lyrics */}
          <span style={{
            fontWeight: 500,
            color: "var(--primary)",
            fontSize: "1.25rem"
          }}>
            [Lyrics display placeholder]
          </span>
          <div style={{ fontSize: "1rem", marginTop: 8, color: "var(--text-secondary)" }}>
            Synced lyrics will appear here as you sing
          </div>
        </div>
      </div>
      {/* Record/Stop Controls and Filter Selection Section */}
      <div style={{
        display: "flex",
        flexDirection: "row",
        gap: "32px",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: 18
      }}>
        {/* Record/Stop Button – Scaffold only, no recording logic */}
        <div style={{ flex: 1, minWidth: 180, maxWidth: 340 }}>
          <div style={{ marginBottom: 6, fontWeight: 500 }}>Controls</div>
          <button
            className="btn btn-large"
            style={{
              background: "var(--accent)",
              color: "#10100b",
              width: "100%",
              fontWeight: 700,
              fontSize: "1.07rem"
            }}
            // Placeholder handler
            onClick={() => { alert("Recording feature coming soon!"); }}
            aria-label="Start Recording"
          >
            <span role="img" aria-label="mic">🎙️</span> Record
          </button>
          <button
            className="btn btn-large"
            style={{
              background: "#d43a58",
              color: "white",
              width: "100%",
              fontWeight: 700,
              fontSize: "1.07rem",
              marginTop: 12
            }}
            disabled
            aria-label="Stop Recording"
          >
            <span role="img" aria-label="stop">⏹️</span> Stop
          </button>
        </div>
        {/* Voice Filter Selection – placeholder only */}
        <div style={{
          flex: 1,
          minWidth: 180,
          maxWidth: 340,
          background: "#171820",
          padding: "16px 20px",
          borderRadius: 8,
          border: "1px solid var(--border-color)"
        }}>
          <div style={{
            fontWeight: 500,
            color: "var(--primary)",
            marginBottom: 10
          }}>
            Voice Filter
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
            [Coming soon: choose voice effects for your vocals here!]
          </div>
        </div>
      </div>
      {/* Future enhancements: visualization, playback, share */}
    </div>
  );
}

export default RecordingScreen;
