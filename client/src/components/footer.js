import React from "react";
// import { Route, Link, Routes, useLocation } from "react-router-dom";
import "../App.css";


const Footer = () => {

  return (
    <footer class="footer">
    <h3>St-Ambrose College Library</h3>
    <span>FAQ</span>
    <span>Terms of service</span>
    <span>Account</span>
</footer>
  );
};

// https://stackoverflow.com/questions/48846289/why-is-my-react-component-is-rendering-twice
// My navbar component was rendering twice for some reason so i followed this stackoverflow thread to fix it.

export default Footer;
