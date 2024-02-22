import "./App.css";
import React from "react";
import Navbar from "./components/navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/navbar";
import Admin from "./pages/admin";
import Account from "./pages/account";
import Circulation from "./pages/circulation";
import Catalogue from "./pages/catalogue";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/contact" element={<Account />} />
        <Route path="/circulation" element={<Circulation />} />
        <Route path="/catalogue" element={<Catalogue />} />
      </Routes>
    </Router>
  );
}

export default App;
