import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Layout from "./containers/Layout";
import Home from "./containers/Home";
import SongLibrary from "./containers/SongLibrary";

/**
 * PUBLIC_INTERFACE
 * Main App component for KaraVibe – handles routing and global layout.
 */
function App() {
  // Ensure dark mode is set
  React.useEffect(() => {
    document.body.setAttribute("data-theme", "dark");
  }, []);

  // Placeholder RecordingScreen route
  function RecordingPlaceholder() {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <div className="title" style={{ fontSize: "2rem" }}>Recording Screen Coming Soon</div>
        <div style={{ color: "var(--text-secondary)", marginTop: 10 }}>
          Get ready to record your karaoke performance!
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/songs" element={<SongLibrary />} />
          <Route path="/record/:songId" element={<RecordingPlaceholder />} />
          {/* Add more routes as features/screens are implemented */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;