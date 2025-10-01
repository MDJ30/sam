import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Article from "./pages/Article";
import News from "./pages/News";
import Team from "./pages/Team";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/article/:id" element={<Article />} />
        <Route path="/news" element={<News />} />
        <Route path="/team" element={<Team/>}/>

        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
}

export default App;