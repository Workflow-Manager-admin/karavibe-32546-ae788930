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
  // Unified recording flag for child component sync
  const [isRecording, setIsRecording] = useState(false);

  // Auto update currentTime in sync with audio, and keep as master clock for lyrics sync
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

  // Optionally implement simple play/pause controls for user interaction for demo, disabled when recording
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isRecording) return; // Do nothing if recording (controls are locked)
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  // When recording flag becomes true, start audio playback and reset
  useEffect(() => {
    const audio = audioRef.current;
    if (isRecording && audio) {
      // When we start recording, restart instrumental audio and play
      audio.currentTime = 0; // Reset to start
      audio.play();
    }
    // When we stop recording, pause instrumental track
    if (!isRecording && audio) {
      audio.pause();
    }
    // eslint-disable-next-line
  }, [isRecording]);

  // Reset lyrics & progress if song changes (unlikely once loaded, but for robustness)
  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
    setIsRecording(false); // reset recording as well on song switch
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
          {/* Simple audio player control, disables Play/Pause during recording */}
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
            // native controls allowed, but we lock custom controls below
            disabled={isRecording ? true : undefined}
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
                marginRight: 10,
                opacity: isRecording ? 0.45 : 1,
                cursor: isRecording ? "not-allowed" : "pointer"
              }}
              aria-label={isPlaying ? "Pause" : "Play"}
              disabled={isRecording}
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
        <RecordingControls
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          audioRef={audioRef}
          song={song}
        />
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

/**
 * PUBLIC_INTERFACE
 * RecordingControls
 * Provides microphone access, voice recording using MediaRecorder, and audio playback.
 * UI: Start Recording, Stop Recording, Play Recording controls, and in-page audio player.
 */
/**
 * PUBLIC_INTERFACE
 * RecordingControls (Sync/Enhanced)
 * Provides microphone access, voice recording using MediaRecorder, and unified audio/lyrics sync for recording.
 * Props:
 *    isRecording: boolean, if currently recording (controlled by parent)
 *    setIsRecording: fn, to change recording state (to control parent sync)
 *    audioRef: ref to the instrumental audio DOM element
 */
function RecordingControls({ isRecording, setIsRecording, audioRef, song }) {
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [fileName, setFileName] = useState("");
  // Metadata fields (for demonstration can be edited/extended)
  const [metaTitle, setMetaTitle] = useState(song?.title ?? "");
  const [metaArtist, setMetaArtist] = useState(song?.artist ?? "");

  const audioPlayerRef = useRef(null);

  // Track support for MediaRecorder and playback MIME
  const [recordingSupported, setRecordingSupported] = useState(
    typeof window !== "undefined" && !!window.MediaRecorder
  );
  const [playbackSupported, setPlaybackSupported] = useState(false);

  const preferredMimeType = "audio/webm;codecs=opus";
  const fallbackMimeType = "audio/webm";

  useEffect(() => {
    // Check playback browser support for our recorded type (after first render)
    if (typeof window !== "undefined" && window.MediaRecorder && window.Audio) {
      const a = document.createElement("audio");
      let canPlay = a.canPlayType(preferredMimeType) || a.canPlayType(fallbackMimeType) || "";
      setPlaybackSupported(!!canPlay);
    }
  }, []);

  useEffect(() => {
    // Cleanup blob URL when component unmounts or when new recording is made
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    const player = audioPlayerRef.current;
    if (!player) return;
    const onEnded = () => setIsPlayingRecording(false);
    player.addEventListener("ended", onEnded);
    return () => {
      player.removeEventListener("ended", onEnded);
    };
  }, []);

  // Handler: Start recording (sync with audio and parent)
  const handleStartRecording = async () => {
    setErrorMsg(null);
    if (!recordingSupported) {
      setErrorMsg("Recording is not supported in your browser.");
      return;
    }
    // Request mic permission
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let mimeType = "";
      if (window.MediaRecorder.isTypeSupported && window.MediaRecorder.isTypeSupported(preferredMimeType)) {
        mimeType = preferredMimeType;
      } else if (window.MediaRecorder.isTypeSupported && window.MediaRecorder.isTypeSupported(fallbackMimeType)) {
        mimeType = fallbackMimeType;
      } else {
        setErrorMsg("Your browser does not support the required audio recording format. Try Chrome/Edge/Firefox.");
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      setRecordedChunks([]); // Clear prev
      const recorder = new window.MediaRecorder(stream, { mimeType });
      setMediaRecorder(recorder);

      recorder.ondataavailable = event => {
        if (event.data.size > 0) setRecordedChunks(prev => prev.concat(event.data));
      };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: mimeType });
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        const audioBlobUrl = URL.createObjectURL(blob);
        setAudioUrl(audioBlobUrl);
        setDownloadUrl(null);
        setDownloadSuccess(false);
        // Build a suggested filename from metadata if available
        let baseName = "karaoke-recording";
        if (metaTitle && metaArtist) {
          baseName = `${metaTitle} - ${metaArtist}`.replace(/[^\w\d _-]/g, "");
        } else if (metaTitle) {
          baseName = `${metaTitle}`.replace(/[^\w\d _-]/g, "");
        }
        setFileName(`${baseName}.${mimeType.includes("wav") ? "wav" : "webm"}`);
        stream.getTracks().forEach(track => track.stop()); // Clean up mic
        setIsRecording(false); // finish recording state (propagates out to parent)
      };

      // ---- Begin "karaoke sync": 1) Start MediaRecorder 2) Play audio from start 3) Lyrics sync managed by parent using audioRef ----
      // (signal to parent that recording is initiated - which triggers audio to start at t=0)
      setIsRecording(true); // Will cause (in parent) to reset and play audio from start

      // Note: Start recorder once audio is playing from t=0 for maximal sync
      // Wait for audio play promise (auto-play), fall back to immediate start after short delay if needed
      const audioEl = audioRef?.current;
      if (audioEl) {
        audioEl.currentTime = 0;
        const p = audioEl.play();
        // For modern browsers, start recorder when playback starts
        if (p && typeof p.then === "function") {
          p.then(() => {
            // Slightly delayed to allow audio to start (for best sync)
            setTimeout(() => recorder.start(), 80);
          }).catch(() => {
            // If failed, still try starting
            recorder.start();
          });
        } else {
          recorder.start();
        }
      } else {
        recorder.start();
      }
      setAudioUrl(null);
      setErrorMsg(null);
    } catch (err) {
      setErrorMsg("Microphone access denied or not available.");
    }
  };

  // Handler: Stop recording (sync all)
  const handleStopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setMediaRecorder(null);
      // Also pause the instrumental audio and let parent know to halt lyrics/audio
      setIsRecording(false); // Will propagate to parent, which will pause audio
      if (audioRef && audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  // Handler: Play the latest recording
  const handlePlayRecording = async () => {
    if (audioPlayerRef.current && audioUrl && !isRecording) {
      try {
        audioPlayerRef.current.currentTime = 0;
        const p = audioPlayerRef.current.play();
        if (p && typeof p.then === "function") {
          await p;
        }
        setIsPlayingRecording(true);
      } catch (err) {
        setErrorMsg("Playback error: Your browser may not support this audio format or playback was interrupted.");
        setIsPlayingRecording(false);
      }
    }
  };

  // Handler: Save/Download the latest recording with metadata (if any)
  const handleSaveRecording = (e) => {
    e.preventDefault();
    setDownloadSuccess(false);

    if (!audioUrl || recordedChunks.length === 0) {
      setErrorMsg("No recording to save.");
      return;
    }
    // Compose blob and optionally metadata (.webm/.wav do not support user metadata in-browser for download, 
    // but we create a metadata JSON for demo and name it similarly)
    const mime = recordedChunks[0]?.type || "audio/webm";
    const combinedBlob = new Blob(recordedChunks, { type: mime });
    const url = URL.createObjectURL(combinedBlob);

    // Save the audio file
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "karaoke-recording.webm";
    document.body.appendChild(link);
    link.click();
    setDownloadSuccess(true);
    setDownloadUrl(url);

    // Also allow downloading metadata separately (optional UX demonstration)
    if (metaTitle || metaArtist) {
      const metadata = {
        title: metaTitle,
        artist: metaArtist,
        file: link.download,
        date: new Date().toISOString()
      };
      const metadataBlob = new Blob(
        [JSON.stringify(metadata, null, 2)],
        { type: "application/json" }
      );
      const metadataUrl = URL.createObjectURL(metadataBlob);
      
      setTimeout(() => {
        const metaLink = document.createElement("a");
        metaLink.href = metadataUrl;
        metaLink.download = `${fileName.replace(/\.\w+$/, '')}.meta.json`;
        document.body.appendChild(metaLink);
        metaLink.click();
        document.body.removeChild(metaLink);
      }, 350); // Slight delay to avoid browser restrictions
    }
    document.body.removeChild(link);
  };

  const playButtonEnabled = !!audioUrl && !isRecording && playbackSupported;
  const saveButtonEnabled = !!audioUrl && !isRecording && recordedChunks.length > 0;

  return (
    <div style={{ flex: 1, minWidth: 200, maxWidth: 350, display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ marginBottom: 6, fontWeight: 500 }}>Controls</div>
      {/* Show error/fallback message if any */}
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

      {/* Metadata fields to optionally edit/persist */}
      {(audioUrl && !isRecording && (metaTitle || metaArtist !== undefined)) && (
        <form style={{ marginBottom: 7 }}>
          <div style={{ marginBottom: 7 }}>
            <label style={{ fontWeight: 400, marginRight: 6 }}>Title:</label>
            <input
              type="text"
              value={metaTitle}
              onChange={e => setMetaTitle(e.target.value)}
              style={{ width: "62%", padding: "3px 8px", borderRadius: 3, border: "1px solid #777", marginRight: 4, fontSize: 13 }}
            />
          </div>
          <div style={{ marginBottom: 5 }}>
            <label style={{ fontWeight: 400, marginRight: 6 }}>Artist:</label>
            <input
              type="text"
              value={metaArtist}
              onChange={e => setMetaArtist(e.target.value)}
              style={{ width: "62%", padding: "3px 8px", borderRadius: 3, border: "1px solid #777", fontSize: 13 }}
            />
          </div>
        </form>
      )}

      {!recordingSupported && (
        <div style={{
          color: "#d43a58",
          fontSize: 13,
          marginBottom: 8
        }}>
          Sorry, your browser does not support audio recording (
          <span style={{ fontFamily: "monospace", fontSize: "0.97em" }}>MediaRecorder</span>).
        </div>
      )}
      {!playbackSupported && (
        <div style={{
          color: "#d43a58",
          fontSize: 13,
          marginBottom: 8
        }}>
          Sorry, your browser does not support playback of this audio format.
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
        disabled={isRecording || !recordingSupported}
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
          opacity: playButtonEnabled ? 1 : 0.5,
          cursor: playButtonEnabled ? "pointer" : "not-allowed"
        }}
        onClick={handlePlayRecording}
        disabled={!playButtonEnabled}
        aria-label="Play Recording"
      >
        <span role="img" aria-label="play">▶️</span> Play Recording
      </button>
      {/* Save button appears only when a recording is available and not recording */}
      <button
        className="btn btn-large"
        style={{
          background: "#53d464",
          color: "#191a1a",
          width: "100%",
          fontWeight: 700,
          fontSize: "1.07rem",
          marginTop: 10,
          opacity: saveButtonEnabled ? 1 : 0.5,
          cursor: saveButtonEnabled ? "pointer" : "not-allowed",
          border: "1px solid var(--primary)"
        }}
        onClick={handleSaveRecording}
        disabled={!saveButtonEnabled}
        aria-label="Save Recording"
      >
        <span role="img" aria-label="save">💾</span> Save Recording
      </button>

      {downloadSuccess && downloadUrl && (
        <div style={{ marginTop: 24, background: "#171c18", padding: 12, border: "1px solid var(--primary)", borderRadius: 7, textAlign: "center" }}>
          <div style={{ color: "var(--primary)", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
            🎉 Recording Saved!
          </div>
          <div>
            <a
              href={downloadUrl}
              download={fileName}
              style={{ color: "#53d464", fontWeight: 600, fontSize: 15, marginRight: 10, textDecoration: "underline" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download audio
            </a>
            <span style={{ color: "var(--text-secondary)", fontSize: 13, marginLeft: 3 }}>|</span>
            <a
              href={downloadUrl}
              style={{ color: "#7691ff", fontWeight: 600, fontSize: 15, marginLeft: 7, textDecoration: "underline" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Playback
            </a>
          </div>
        </div>
      )}

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
