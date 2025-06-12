import React from "react";
import "../App.css";

/**
 * PUBLIC_INTERFACE
 * LyricsDisplay receives `lyrics` (array of {text, time}) and `currentTime` (sec)
 * Props:
 *   lyrics: [{ text: string, time: number }]  // time is in seconds, sorted ascending
 *   currentTime: number    // current audio time (seconds)
 */
function LyricsDisplay({ lyrics, currentTime }) {
  if (!lyrics || lyrics.length === 0) {
    return (
      <div style={{
        color: "var(--text-secondary)",
        textAlign: "center",
        fontStyle: "italic"
      }}>
        No lyrics available.
      </div>
    );
  }

  // Find the currently active lyric line (the last line whose time <= currentTime)
  let activeIdx = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) activeIdx = i;
    else break; // times are sorted
  }

  // To keep a good visual context, optionally show +/- 2 lines
  const linesToShow = 5;
  const offset = Math.max(activeIdx - Math.floor(linesToShow / 2), 0);
  const shown = lyrics.slice(offset, offset + linesToShow);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        borderRadius: 6,
        background: "#23243b",
        border: "1px solid var(--border-color)",
        padding: "18px 14px",
        color: "var(--text-color)",
        textAlign: "center",
        fontFamily: "'Inter','Roboto',sans-serif",
        minHeight: 148,
        boxSizing: "border-box",
        lineHeight: 1.6
      }}
      aria-live="polite"
    >
      {shown.map((line, i) => {
        const idx = offset + i;
        const isActive = idx === activeIdx;
        return (
          <div
            key={idx}
            style={{
              fontWeight: isActive ? 800 : 400,
              color: isActive ? "var(--primary)" : "var(--text-secondary)",
              fontSize: isActive ? "1.35rem" : "1.03rem",
              background: isActive ? "rgba(29,185,84,0.08)" : "none",
              borderRadius: isActive ? 4 : 0,
              padding: isActive ? "2px 8px" : "1px 8px",
              margin: isActive ? "4px 0" : "1.5px 0",
              transition: "background 0.2s, color 0.21s"
            }}
            aria-current={isActive ? "true" : undefined}
          >
            {line.text}
          </div>
        );
      })}
    </div>
  );
}

export default LyricsDisplay;
