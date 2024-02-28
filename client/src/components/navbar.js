import React from "react";
// import { Route, Link, Routes, useLocation } from "react-router-dom";
import "../App.css";

const navbar_sections_names = ["Admin", "Circulation", "Catalogue", "Account"];

const navbar_names_routes = [
  [
    ["Dashboard", "/admin#adminDashboardElement"],
    ["Users", "/admin#adminUsersElement"],
    ["Library", "/admin#adminLibraryElement"]
  ],
  [
    ["Borrowing", "/circulation#cicrulationBorrowingElement"],
    ["Lates", "/circulation#circulationLatesElement"],
    ["Hold Requests", "/circulation#circulationHoldRequestsElement"],
  ],
  [
    ["Search", "/catalogue#catalogueSearchElement"],
    ["Manage", "/catalogue#catalogueManageElement"],
    ["Locate", "/catalogue#catalogueLocateElement"],
  ],
  [
    ["Preferences", "/account#accountPreferencesElement"],
    ["Integrations", "/accountaccountNotificationsElement#"],
    ["Notifications", "/account#accountBorrowingHistoryElement"],
    ["Borrowing History", "/account#accountIntegrationsElement"],
  ],
];

const NavbarElement = (props) => {
  const { fields, name } = props;
  const dropdown_elements = fields.map((element) => {
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
