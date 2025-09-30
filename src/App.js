import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Article from "./pages/Article";
import News from "./pages/News";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/article/:id" element={<Article />} />
        <Route path="/news" element={<News />} />

        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
}

export default App;