import React from "react";
import { useNavigate } from "react-router-dom";
import songs from "../assets/songs.json";
import SongCard from "../components/SongCard";

/**
 * PUBLIC_INTERFACE
 * Homepage container - Dashboard for KaraVibe. Features: App intro, featured songs, main navigation.
 */
function Home() {
  const navigate = useNavigate();

  // Select top 3 featured songs for the homepage
  const featured = songs.slice(0, 3);

  // Quick stats using mock data
  const stats = [
    {
      title: "Songs Available",
      value: songs.length,
      icon: "🎵",
      color: "var(--primary)"
    },
    {
      title: "Genres",
      value: [...new Set(songs.map(s => s.genre))].length,
      icon: "💽",
      color: "var(--accent)"
    },
    {
      title: "Record & Share",
      value: "Unlimited",
      icon: "🎤",
      color: "#7691ff"
    }
  ];

  // Handler for "Explore Songs" and Song Card navigation
  const goToLibrary = () => navigate("/songs");
  const handleSongSelect = (song) => navigate(`/record/${song.id}`);

  return (
    <div style={{ padding: "36px 0 64px 0", minHeight: "80vh" }}>
      {/* HERO */}
      <section className="hero" style={{
        background: "linear-gradient(90deg, #18181E 60%, #242a29 100%)",
        borderRadius: 18,
        boxShadow: "0 8px 40px #0003",
        marginBottom: 48,
        padding: "80px 24px 48px 24px"
      }}>
        <div className="subtitle" style={{ marginBottom: 6 }}>Your Karaoke Playground</div>
        <h1 className="title" style={{ fontWeight: 700, fontSize: "3.2rem", marginBottom: 10 }}>
          Welcome to KaraVibe
        </h1>
        <div className="description" style={{ fontSize: "1.18rem" }}>
          Sing along to trending tracks, view synced lyrics, record your performance, and have fun with awesome vocal effects!
        </div>
        <button
          className="btn btn-large"
          style={{
            background: "var(--primary)",
            color: "#fff",
            marginTop: 28,
            fontWeight: 600,
            fontSize: "1.08rem",
            boxShadow: "0 3px 16px #1db95433"
          }}
          onClick={goToLibrary}
        >
          Explore Song Library
        </button>
        {/* Quick summary stats (desktop-like) */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "28px",
          marginTop: 38,
          width: "100%"
        }}>
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                background: "#19181A",
                border: "1px solid var(--border-color)",
                borderRadius: 10,
                padding: "22px 38px",
                minWidth: 130,
                boxShadow: "0 2px 12px #0002",
                textAlign: "center"
              }}
            >
              <span style={{ fontSize: 25, marginBottom: 7, display: "inline-block", color: s.color }}>{s.icon}</span>
              <div style={{ fontWeight: 600, fontSize: "1.14rem" }}>{s.value}</div>
              <div style={{ color: "var(--accent)", fontSize: 13, letterSpacing: 1, marginTop: 2 }}>{s.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED SONGS */}
      <section style={{
        margin: "0 auto",
        marginBottom: 30,
        maxWidth: 900
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          marginBottom: 20
        }}>
          <div style={{ fontSize: "1.4rem", fontWeight: 600 }}>Featured Songs</div>
          <button
            className="btn"
            style={{
              background: "var(--accent)",
              color: "#191a1a",
              fontWeight: 600,
              fontSize: "1rem"
            }}
            onClick={goToLibrary}
          >
            See All &rarr;
          </button>
        </div>
        <div style={{ marginTop: 8 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 34
          }}>
            {featured.map(song => (
              <SongCard
                key={song.id}
                song={song}
                onSelect={() => handleSongSelect(song)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* NAVIGATION SHORTCUTS */}
      <section style={{
        marginTop: 46,
        marginBottom: 10,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 34
      }}>
        {/* Library */}
        <button
          onClick={goToLibrary}
          className="btn btn-large"
          style={{
            background: "var(--primary)",
            color: "#fff",
            minWidth: 156,
            fontWeight: 600
          }}
        >
          🎼 Song Library
        </button>
        {/* Record - goes to a recording selection screen or picks first song for demo */}
        <button
          onClick={() => handleSongSelect(featured[0])}
          className="btn btn-large"
          style={{
            background: "var(--accent)",
            color: "#191a14",
            minWidth: 156,
            fontWeight: 600
          }}
        >
          🎤 Start Recording
        </button>
      </section>
    </div>
  );
}

export default Home;
