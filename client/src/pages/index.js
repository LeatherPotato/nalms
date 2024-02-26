import React, { useState } from "react";
import "../App.css";
import GlobalVars from "../Global";
import App from "../App";

class LoginComponent extends React.Component {
  state = {
    username: "",
    password: "",
  };

  setUserId = (returnedUserId) => {
    App.state.userId = returnedUserId;
  };

  handleChanges = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    console.log(name,value)
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    };

    fetch(GlobalVars.serverURL.concat("login/"), requestOptions)
      .then((response) => response.json())
      .then((data) => GlobalVars.userId = data.UserId)
      .then(console.log(GlobalVars));
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} class="form">
        <div class="form-input">
          <label for="username">Username</label>
          <input
            type="text"
            name="username"
            onChange={this.handleChanges}
            placeholder="Username"
          />
        </div>
        <div class="form-input">
          <label for="password">Password</label>
          <input
            type="password"
            name="password"
            onChange={this.handleChanges}
            placeholder="Password"
          />
        </div>
        <div class="form-input">
          <button name="submitButton">Login</button>
        </div>
      </form>
    );
  }
}

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: -1,
    };
  }

  render() {
    return (
      <div id="page">
        <main>
          <h2>Login</h2>
          <LoginComponent />
        </main>
      </div>
    );
  }
}

export default Home;
