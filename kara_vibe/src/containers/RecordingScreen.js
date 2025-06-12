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
        {/* Record, Stop, Play logic implemented – handles browser mic recording & playback */}
        <RecordingControls />
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

// PUBLIC_INTERFACE
/**
 * RecordingControls
 * Provides microphone access, voice recording using MediaRecorder, and audio playback.
 * UI: Start Recording, Stop Recording, Play Recording controls, and in-page audio player.
 */
function RecordingControls() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const audioPlayerRef = useRef(null);
  const [recordingSupported, setRecordingSupported] = useState(typeof window !== "undefined" && !!(window.MediaRecorder));

  useEffect(() => {
    // Cleanup blob URL when component unmounts or when new recording is made
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Handle playback ended to update play button state
  useEffect(() => {
    const player = audioPlayerRef.current;
    if (!player) return;
    const onEnded = () => setIsPlayingRecording(false);
    player.addEventListener("ended", onEnded);
    return () => {
      player.removeEventListener("ended", onEnded);
    };
  }, []);

  // Handler: Start recording
  const handleStartRecording = async () => {
    setErrorMsg(null);
    if (!recordingSupported) {
      setErrorMsg("Recording is not supported in your browser.");
      return;
    }
    // Ask for mic permission
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new window.MediaRecorder(stream);
      setMediaRecorder(recorder);
      setRecordedChunks([]); // Clear prev
      recorder.ondataavailable = event => {
        if (event.data.size > 0) setRecordedChunks(prev => prev.concat(event.data));
      };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "audio/webm" });
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(URL.createObjectURL(blob));
        // Stop mic tracks
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
      };
      recorder.start();
      setIsRecording(true);
      setAudioUrl(null);
    } catch (err) {
      setErrorMsg("Microphone access denied or not available.");
    }
  };

  // Handler: Stop recording
  const handleStopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }
  };

  // Handler: Play the latest recording
  const handlePlayRecording = () => {
    if (audioPlayerRef.current && audioUrl) {
      audioPlayerRef.current.currentTime = 0;
      audioPlayerRef.current.play();
      setIsPlayingRecording(true);
    }
  };

  return (
    <div style={{ flex: 1, minWidth: 200, maxWidth: 350, display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ marginBottom: 6, fontWeight: 500 }}>Controls</div>
      {/* Show error message if any */}
      {errorMsg && (
        <div style={{
          color: "#d43a58",
          fontSize: 14,
          marginBottom: 7,
          background: "rgba(85,0,0,0.09)",
          borderRadius: 4,
          padding: 6
        }}>
          {errorMsg}
        </div>
      )}
      <button
        className="btn btn-large"
        style={{
          background: isRecording ? "var(--secondary)" : "var(--accent)",
          color: "#10100b",
          width: "100%",
          fontWeight: 700,
          fontSize: "1.07rem",
          opacity: isRecording ? 0.5 : 1,
          cursor: isRecording ? "not-allowed" : "pointer",
          transition: "background .18s"
        }}
        onClick={handleStartRecording}
        disabled={isRecording}
        aria-label="Start Recording"
      >
        <span role="img" aria-label="mic">🎙️</span> Start Recording
      </button>
      <button
        className="btn btn-large"
        style={{
          background: "#d43a58",
          color: "white",
          width: "100%",
          fontWeight: 700,
          fontSize: "1.07rem",
          marginTop: 10,
          opacity: !isRecording ? 0.5 : 1,
          cursor: !isRecording ? "not-allowed" : "pointer"
        }}
        onClick={handleStopRecording}
        disabled={!isRecording}
        aria-label="Stop Recording"
      >
        <span role="img" aria-label="stop">⏹️</span> Stop Recording
      </button>
      <button
        className="btn btn-large"
        style={{
          background: "#7691ff",
          color: "#191a1a",
          width: "100%",
          fontWeight: 700,
          fontSize: "1.07rem",
          marginTop: 10,
          opacity: !audioUrl || isRecording ? 0.5 : 1,
          cursor: !audioUrl || isRecording ? "not-allowed" : "pointer"
        }}
        onClick={handlePlayRecording}
        disabled={!audioUrl || isRecording}
        aria-label="Play Recording"
      >
        <span role="img" aria-label="play">▶️</span> Play Recording
      </button>
      {/* Show audio player only if recording is present */}
      {audioUrl && (
        <div style={{ marginTop: 16 }}>
          <audio
            ref={audioPlayerRef}
            src={audioUrl}
            controls
            style={{
              width: "100%",
              background: "#232535",
              borderRadius: 8,
              boxShadow: "0 1px 10px #14131433",
            }}
          />
          {isPlayingRecording && (
            <div style={{ color: "var(--primary)", fontWeight: 600, textAlign: "center", fontSize: 14, marginTop: 4 }}>
              Playing your latest take...
            </div>
          )}
        </div>
      )}
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
