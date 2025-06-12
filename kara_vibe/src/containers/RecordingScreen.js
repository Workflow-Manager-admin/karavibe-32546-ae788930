import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import songsData from "../assets/songs.json";
import LyricsDisplay from "../components/LyricsDisplay";

/**
 * PUBLIC_INTERFACE
 * RecordingScreen container – allows user to play instrumental, see (synced) lyrics,
 * record vocals, and select voice filters (placeholder). Receives songId via route param.
 */
function RecordingScreen() {
  const { songId } = useParams();
  const navigate = useNavigate();

  // Find the selected song data
  const song = songsData.find((s) => String(s.id) === String(songId));

  // MOCK: Lyrics with timestamps demo for each song (for real app, would fetch per song)
  // Simple lines with time in seconds for testing sync
  const demoLyrics = [
    { time: 0, text: "[Intro]" },
    { time: 2, text: "Tell me somethin', girl" },
    { time: 6, text: "Are you happy in this modern world?" },
    { time: 10, text: "Or do you need more?" },
    { time: 14, text: "Is there somethin' else you're searchin' for?" },
    { time: 20, text: "[Chorus]" },
    { time: 22, text: "I'm fallin'" },
    { time: 25, text: "In all the good times I find myself" },
    { time: 29, text: "Longin' for change" },
    { time: 33, text: "And in the bad times, I fear myself" },
    { time: 40, text: "..." },
  ];

  // For real implementation, switch lyrics per song/ID from a (future) backend.
  const lyrics = demoLyrics;

  // Audio fake/mock: use a demo track, but for demonstration, let's use <audio> w/ a short sample instrumental URL.
  // To keep it simple, use a royalty-free sample if in prod; for now, use a short data URI or placeholder.
  // Here, we'll use a <audio> and simulate progress for lyric sync.

  // Use ref to access and control audio element
  const audioRef = useRef(null);

  // For lyrics sync: controlled by audio element's currentTime (state needed for re-render)
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto update currentTime in sync with audio
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    // Listen to timeupdate, play, pause, seeked
    const onTimeUpdate = () => setCurrentTime(audioEl.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onSeeked = () => setCurrentTime(audioEl.currentTime);

    audioEl.addEventListener("timeupdate", onTimeUpdate);
    audioEl.addEventListener("play", onPlay);
    audioEl.addEventListener("pause", onPause);
    audioEl.addEventListener("seeked", onSeeked);

    // Clean up
    return () => {
      audioEl.removeEventListener("timeupdate", onTimeUpdate);
      audioEl.removeEventListener("play", onPlay);
      audioEl.removeEventListener("pause", onPause);
      audioEl.removeEventListener("seeked", onSeeked);
    };
  }, []);

  // Optionally implement simple play/pause controls for user interaction for demo
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  // Reset lyrics & progress if song changes (unlikely once loaded, but for robustness)
  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
  }, [songId]);

  // Fallback for invalid song
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
      {/* Instrumental Playback Area + Synced Lyrics */}
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
          gap: 20,
        }}
      >
        {/* Audio Player Demo - use a short copyright-free audio */}
        <div style={{ width: "100%", maxWidth: 330, textAlign: "center" }}>
          <div style={{
            color: "var(--accent)",
            fontWeight: 500,
            marginBottom: 9,
            fontSize: "1.15rem"
          }}>
            Instrumental Track
          </div>
          {/* Simple audio player control (using a sample) */}
          <audio
            ref={audioRef}
            src="https://cdn.pixabay.com/audio/2022/08/20/audio_124bfa496e.mp3" // Royalty-free short track (<1min) for demo
            controls
            style={{
              width: "100%",
              marginTop: 3,
              marginBottom: 6,
              background: "#232535",
              borderRadius: 8,
              boxShadow: "0 1px 10px #14131433",
            }}
          />
          <div style={{ margin: "8px 0" }}>
            <button
              className="btn"
              onClick={handlePlayPause}
              style={{
                fontWeight: 600,
                background: isPlaying ? "#d43a58" : "var(--primary)",
                color: isPlaying ? "white" : "#fff",
                borderRadius: 22,
                padding: "7px 30px",
                marginRight: 10
              }}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <span style={{
              color: "var(--text-secondary)",
              fontSize: 13,
              marginLeft: 8
            }}>
              {formatTime(currentTime)}
            </span>
          </div>
        </div>
        {/* Lyrics Display synced with the audio */}
        <LyricsDisplay lyrics={lyrics} currentTime={currentTime} />
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

// Utility to format seconds to mm:ss
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default RecordingScreen;
