import React from "react";

/**
 * PUBLIC_INTERFACE
 * Homepage container - landing page for KaraVibe.
 */
function Home() {
  return (
    <div className="hero">
      <div className="subtitle">Your Karaoke Playground</div>
      <h1 className="title">Welcome to KaraVibe</h1>
      <div className="description">
        Sing along to your favorite tracks, see synced lyrics, record your vocals, and have fun with cool voice effects!
      </div>
      <button className="btn btn-large" style={{ background: "var(--primary)" }}>
        Explore Songs
      </button>
    </div>
  );
}

export default Home;
