import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Article from "./pages/Article";
import News from "./pages/News";
import Team from "./pages/Team";
import Stats from "./pages/Stats";

function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>404 - Page Not Found</h1>
      <p>This page is temporarily unavailable.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NotFound />} />
        <Route path="/admin" element={<NotFound />} />
        <Route path="/article/:id" element={<NotFound />} />
        <Route path="/news" element={<NotFound />} />
        <Route path="/team" element={<NotFound />} />
        <Route path="/stats" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;