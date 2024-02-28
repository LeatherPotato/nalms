import React from "react";
import "../App.css";
const  Preferences = () => {
    return (
        <div id="accountPreferencesElement">
            <h1>Preferences Element</h1>
            <p>content goes here</p>
        </div>
    );
};

const Notifications = () => {
    return (
        <div id="accountNotificationsElement">
            <h1>Notifications Element</h1>
            <p>content goes here</p>
        </div>
    );
};

const BorrowingHistory = () => {
    return (
        <div id="accountBorrowingHistoryElement">
            <h1>Borrowing History Element</h1>
            <p>content goes here</p>
        </div>
    );
};

const Integrations = () => {
    return (
        <div id="accountIntegrationsElement">
            <h1>Integrations Element</h1>
            <p>content goes here</p>
        </div>
    );
};

class Account extends React.Component {
  render() {
    return (
      <div id="page">
        <Preferences />
        <Notifications />
        <BorrowingHistory />
        <Integrations />
      </div>
    );
  }
}

export default Account;
