import React from "react";
import "../App.css";

const  Borrowing = () => {
    return (
        <div id="cicrulationBorrowingElement">
            <h1>Borrowing Element</h1>
            <p>content goes here</p>
        </div>
    );
};

const Lates = () => {
    return (
        <div id="circulationLatesElement">
            <h1>Lates Element</h1>
            <p>content goes here</p>
        </div>
    );
};

const HoldRequests = () => {
    return (
        <div id="circulationHoldRequestsElement">
            <h1>Hold-Requests Element</h1>
            <p>content goes here</p>
        </div>
    );
};

class Circulation extends React.Component {
  render() {
    return (
      <div id="page">
        <Borrowing />
        <Lates />
        <HoldRequests />
      </div>
    );
  }
}

export default Circulation;
