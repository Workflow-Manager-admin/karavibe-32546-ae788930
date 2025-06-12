import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import LyricsDisplay from "../components/LyricsDisplay";
import songsData from "../assets/songs.json";

/**
 * PUBLIC_INTERFACE
 * PlaybackScreen: Allows users to play back their saved recordings.
 * Features custom play/pause, seek, progress bar, 
 * metadata display, filter display, and synchronized lyrics.
 * - Receives nav state: { audioUrl, title, artist, filter, lyrics, songId }
 * - Or params for future extensibility.
 */
function PlaybackScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { recordingId } = useParams();

  // 1. Get playback state from navigation state or fallback query/param
  const playbackState = location.state || {};

  // Audio source: Blob URL or remote mp3 (actual impl: recording url, demo: fallback empty disables)
  const audioUrl = playbackState.audioUrl || "";
  // Song metadata
  const [metaTitle, setMetaTitle] = useState(playbackState.title || "");
  const [metaArtist, setMetaArtist] = useState(playbackState.artist || "");
  const [metaFilter, setMetaFilter] = useState(playbackState.filter || "");
  const [metaYear, setMetaYear] = useState(undefined);

  // Fallback: find song in db by id if not supplied
  useEffect(() => {
    if ((!metaTitle || !metaArtist) && playbackState.songId) {
      const song = songsData.find(s => String(s.id) === String(playbackState.songId));
      if (song) {
        setMetaTitle(song.title);
        setMetaArtist(song.artist);
        setMetaYear(song.year);
      }
    }
  }, [playbackState.songId, metaTitle, metaArtist]);

  // Lyrics: from state, else fallback to demo
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
  const lyrics = playbackState.lyrics || demoLyrics;

  // Audio control refs & state
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  // 2. Synchronize: lyrics, seek, play
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    const updateTime = () => setCurrentTime(audioEl.currentTime);
    const updateDuration = () => setDuration(audioEl.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audioEl.addEventListener("timeupdate", updateTime);
    audioEl.addEventListener("durationchange", updateDuration);
    audioEl.addEventListener("play", onPlay);
    audioEl.addEventListener("pause", onPause);

    // Initialize duration for preloaded
    if (audioEl.duration) setDuration(audioEl.duration);
    setCurrentTime(audioEl.currentTime);

    return () => {
      audioEl.removeEventListener("timeupdate", updateTime);
      audioEl.removeEventListener("durationchange", updateDuration);
      audioEl.removeEventListener("play", onPlay);
      audioEl.removeEventListener("pause", onPause);
    };
  }, [audioUrl]);

  // Playback controls
  // PUBLIC_INTERFACE
  function handlePlayPause() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  }
  // Seek when user changes range
  function handleSeek(e) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(e.target.value);
    setCurrentTime(audio.currentTime);
  }
  // PUBLIC_INTERFACE
  function formatTime(sec) {
    if (typeof sec !== "number" || Number.isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // Fallback UX: no audio present disables playback
  if (!audioUrl) {
    return (
      <div style={{ textAlign: "center", marginTop: 40, color: "var(--text-secondary)" }}>
        <div className="title" style={{ fontSize: "2rem" }}>No Recording to Play</div>
        <div style={{ marginTop: 10 }}>
          Please record or select a karaoke to play back.<br />
          <button
            className="btn"
            style={{ marginTop: 18, background: "var(--primary)" }}
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Filter display: humanize string (e.g. "robot" => "Robot Effect", etc.)
  function prettyFilter(label) {
    if (!label) return "None";
    if (label === "robot") return "Robot";
    if (label === "reverb") return "Reverb";
    if (label === "auto-tune") return "Auto-Tune";
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  return (
    <div style={{ maxWidth: 660, margin: "0 auto", padding: "32px 0", minHeight: 480 }}>
      <button
        className="btn"
        style={{ marginBottom: 18 }}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <h1 className="title" style={{ fontSize: "1.9rem" }}>Playback</h1>

      {/* Metadata Section */}
      <div
        style={{
          border: "1px solid var(--border-color)",
          borderRadius: 10,
          background: "rgba(25,25,25,0.89)",
          padding: 24,
          margin: "10px 0 30px 0",
          boxShadow: "0 4px 22px #161A2540"
        }}
      >
        <div style={{ marginBottom: 12, fontWeight: 700, fontSize: 24, color: "var(--primary)" }}>
          {metaTitle || "Untitled"}
        </div>
        <div style={{ fontSize: 18, color: "var(--accent)", marginBottom: 7 }}>
          {metaArtist || <span style={{ color: "var(--text-secondary)" }}>[Unknown Artist]</span>}
        </div>
        {metaYear && (
          <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            Year: {metaYear}
          </div>
        )}
        <div style={{
          color: "var(--text-secondary)",
          fontSize: 14,
          margin: "9px 0 6px 0"
        }}>
          Length: {formatTime(duration)}
        </div>
        <div style={{
          color: "var(--primary)",
          fontSize: 16,
          marginTop: 6
        }}>
          Voice Filter: <span style={{ color: "var(--accent)", fontWeight: 500 }}>{prettyFilter(metaFilter)}</span>
        </div>
      </div>

      {/* Audio playback + controls */}
      <div
        style={{
          border: "1px solid var(--border-color)",
          borderRadius: 10,
          background: "#191a22",
          padding: 24,
          marginBottom: 34,
          boxShadow: "0 2px 20px #10101224",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="auto"
          style={{ display: "none" }}
        />
        <div style={{ width: "100%", maxWidth: 350, margin: "0 auto", marginBottom: 16 }}>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.01}
            value={currentTime}
            onChange={handleSeek}
            style={{
              width: "100%",
              accentColor: "var(--primary)",
              marginBottom: 6,
              cursor: "pointer"
            }}
            aria-label="Seek"
            disabled={!duration}
          />
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
              color: "var(--text-secondary)",
              paddingBottom: 6
            }}
          >
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <button
          className="btn btn-large"
          onClick={handlePlayPause}
          style={{
            background: isPlaying ? "#d43a58" : "var(--primary)",
            color: isPlaying ? "white" : "#191a1a",
            padding: "10px 42px",
            minWidth: 138,
            borderRadius: 24,
            fontWeight: 700,
            fontSize: "1.09rem",
            marginTop: 4,
            marginBottom: 8
          }}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>

      {/* Lyrics (synced) */}
      <div style={{
        margin: "0 auto",
        marginBottom: 28,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        <div style={{
          fontWeight: 500,
          fontSize: 18,
          color: "var(--accent)",
          marginBottom: 10
        }}>
          Lyrics
        </div>
        {/* 
          Pass the lyrics for the current song (or recording) and the audio's currentTime.
          LyricsDisplay will highlight and auto-scroll lyrics in sync with playback progress ("currentTime").
        */}
        <LyricsDisplay
          lyrics={lyrics}
          currentTime={currentTime}
        />
      </div>
    </div>
  );
}

export default PlaybackScreen;
