import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Layout from "./containers/Layout";
import Home from "./containers/Home";
import SongLibrary from "./containers/SongLibrary";
import RecordingScreen from "./containers/RecordingScreen";

/**
 * PUBLIC_INTERFACE
 * Main App component for KaraVibe – handles routing and global layout.
 */
function App() {
  // Ensure dark mode is set
  React.useEffect(() => {
    document.body.setAttribute("data-theme", "dark");
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/songs" element={<SongLibrary />} />
          <Route path="/record/:songId" element={<RecordingScreen />} />
          {/* Add more routes as features/screens are implemented */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;