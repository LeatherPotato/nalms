import React from "react";
import { Route, Link, Routes, useLocation } from "react-router-dom";

const navbar_sections_names = ["Admin", "Circulation", "Catalogue", "Account"]

const navbar_elements = [
    [("Dashboard",), ("Users",), ("Library",), ("Analytics",)],
    [("Borrowing",), ("Late",), ("Hold Requests",)],
    [("Search",), ("Manage",), ("Locate",)],
    [("Preferences",), ("Integrations",), ("Notifications",), ("Borrowing History",)]
];

const navbar_element = (props) => {
  const {name, fields} = props;
  const dropdown_elements = fields.map((element) => {
    return(
        <div>
            <a href={element[1]}>{element[0]}</a>
        </div>
        );
    });
  return (
    <div class="navbar-element">
        {dropdown_elements}
    </div>
  );
};



class Navbar extends React.Component {
  render() {
    return (
      <div>
        <header>
          <h1>NEA Project</h1>
          <span class="material-symbols-outlined icon">library_books</span>
        </header>
        <nav></nav>
      </div>
    );
  }
}

export default Navbar;
