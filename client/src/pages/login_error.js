import React from "react";
import "../App.css";

class LoginError extends React.Component {
  render() {
    return (
      <div id="page">
        <h1>NOT LOGGED IN</h1>
        <a href="/" className="link"><h2>Log-in here</h2></a>
      </div>
    );
  }
}

export default LoginError;
