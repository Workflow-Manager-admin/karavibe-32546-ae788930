import React from "react";

/**
 * PUBLIC_INTERFACE
 * FilterSelector - UI for choosing and describing a voice filter effect.
 * Props:
 *   selectedFilter: string (e.g., "none", "reverb", "robot", "pitch", "auto-tune")
 *   onChange: function(newFilter: string)
 */
function FilterSelector({ selectedFilter, onChange }) {
  const filters = [
    {
      label: "None",
      value: "none",
      description: "Plain voice (no filter)",
      emoji: "🎤"
    },
    {
      label: "Reverb",
      value: "reverb",
      description: "Adds spacious echo for a concert feel.",
      emoji: "🏛️"
    },
    {
      label: "Robot",
      value: "robot",
      description: "Gives your voice a robotic, synthetic sound.",
      emoji: "🤖"
    },
    {
      label: "Pitch Shift",
      value: "pitch",
      description: "Raises or lowers your voice pitch.",
      emoji: "🔊"
    },
    {
      label: "Auto-Tune",
      value: "auto-tune",
      description: "Smooths/synthesizes your voice with auto-tuning.",
      emoji: "🎶"
    }
  ];

  return (
    <div style={{
      background: "#171820",
      padding: "18px 20px",
      borderRadius: 8,
      border: "1px solid var(--border-color)",
      minWidth: 200,
      maxWidth: 340,
      flex: 1
    }}>
      <div style={{ fontWeight: 600, color: "var(--primary)", marginBottom: 10 }}>
        Voice Filter
      </div>
      <div>
        {filters.map(f => (
          <label
            key={f.value}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 9,
              cursor: "pointer",
              background: selectedFilter === f.value ? "#23243b" : "none",
              padding: selectedFilter === f.value ? "5px 8px" : "3px 8px",
              borderRadius: 5,
            }}
          >
            <input
              type="radio"
              name="voice-filter"
              value={f.value}
              checked={selectedFilter === f.value}
              onChange={() => onChange(f.value)}
              style={{ marginRight: 8, accentColor: "var(--primary)" }}
            />
            <span style={{
              fontSize: 18,
              marginRight: 8
            }}>{f.emoji}</span>
            <span style={{
              fontWeight: 500,
              color: selectedFilter === f.value ? "var(--primary)" : "var(--text-secondary)"
            }}>{f.label}</span>
          </label>
        ))}
      </div>
      <div style={{
        marginTop: 10,
        color: "var(--text-secondary)",
        fontSize: "0.98rem",
        minHeight: 28
      }}>
        {filters.find(f => f.value === selectedFilter)?.description}
      </div>
    </div>
  );
}

export default FilterSelector;
