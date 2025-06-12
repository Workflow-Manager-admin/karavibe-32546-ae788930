import React from "react";
import "../App.css";

/**
 * PUBLIC_INTERFACE
 * Navbar component provides top navigation throughout the app.
 */
function Navbar() {
  return (
    <nav className="navbar">
      <div className="container" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div className="logo">
            <span className="logo-symbol" style={{ color: "var(--primary)", fontWeight: 800 }}>*</span>
            <span>KaraVibe</span>
          </div>
          {/* Expand here for user/profile, nav links, dark mode switch, etc. */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
