import React from "react";
import Navbar from "../components/Navbar";

/**
 * PUBLIC_INTERFACE
 * Layout wraps all routes - renders navigation and main area container.
 */
function Layout({ children }) {
  return (
    <div className="app">
      <Navbar />
      <main style={{ paddingTop: 80 }}>
        <div className="container">{children}</div>
      </main>
    </div>
  );
}

export default Layout;
