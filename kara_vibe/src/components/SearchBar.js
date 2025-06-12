import React from "react";

/**
 * PUBLIC_INTERFACE
 * Simple search bar input for filtering/searching list.
 * @param {string} value - Current input value.
 * @param {Function} onChange - Handler for input changes.
 * @param {string} placeholder - Placeholder text.
 */
function SearchBar({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      aria-label="Search"
      style={{
        padding: "10px 16px",
        borderRadius: 6,
        border: "1px solid var(--border-color)",
        width: "100%",
        fontSize: "1rem",
        background: "rgba(25,25,25,0.83)",
        color: "var(--text-color)"
      }}
      onChange={e => onChange(e.target.value)}
    />
  );
}

export default SearchBar;
