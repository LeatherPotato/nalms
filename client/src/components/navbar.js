import React from "react";
// import { Route, Link, Routes, useLocation } from "react-router-dom";
import "../App.css";

const navbar_sections_names = ["Admin", "Circulation", "Catalogue", "Account"];

const navbar_names_routes = [
  [
    ["Dashboard", "/admin/dashboard"],
    ["Users", "/admin/users"],
    ["Library", "/admin/library"]
  ],
  [
    ["Borrowing", "circulation"],
    ["Late", "circulation"],
    ["Hold Requests", "circulation"],
  ],
  [
    ["Search", "/catalogue"],
    ["Manage", "/catalogue"],
    ["Locate", "/catalogue"],
  ],
  [
    ["Preferences", "/account"],
    ["Integrations", "/account"],
    ["Notifications", "/account"],
    ["Borrowing History", "/account"],
  ],
];

const NavbarElement = (props) => {
  const { fields, name } = props;
  const dropdown_elements = fields.map((element) => {
    console.log(element);
    return (
      <a href={element[1]}>
        <div class="dropdownLink">{element[0]}</div>
      </a>
    );
  });
  return (
    <div className="navbarElement">
      {name} <div className="dropDown">{dropdown_elements}</div>
    </div>
  );
};

const Navbar = () => {
  const navbarElements = navbar_names_routes.map((element, index) => {
    console.log("ONE");
    return (
      <NavbarElement fields={element} name={navbar_sections_names[index]} />
    );
  });
  return (
    <nav>
      <div className="navbar">{navbarElements}</div>
    </nav>
  );
};

// https://stackoverflow.com/questions/48846289/why-is-my-react-component-is-rendering-twice
// My navbar component was rendering twice for some reason so i followed this stackoverflow thread to fix it.

export default Navbar;
