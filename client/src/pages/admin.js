import React from "react";
import "../App.css";

const Dashboard = () => {
    return (
        <div id="adminDashboardElement">
            <h1>Dashboard Element</h1>
            <p>content goes here</p>
        </div>
    );
};

const Users = () => {
    return (
        <div id="adminUsersElement">
            <h1>Users Element</h1>
            <p>content goes here</p>
        </div>
    );
};

const Library = () => {
    return (
        <div id="adminLibraryElement">
            <h1>Library Element</h1>
            <p>content goes here</p>
        </div>
    );
};

class Admin extends React.Component {
  render() {
    return (
      <div id="page">
        <Dashboard />
        <Users />
        <Library />
      </div>
    );
  }
}

export {Admin, Dashboard, Users, Library};
