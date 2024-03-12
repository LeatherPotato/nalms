import React from "react";
import "../App.css";
import GLOBALS from "../Global";
import Cookies from "js-cookie";

const WelcomePage = () => {
  return (
    <div>
      <h2>Logged In!</h2>
      <p>Use the navbar to nagivate to a page.</p>
    </div>
  );
};

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      loggedIn: Cookies.get("USER_ID") === undefined ? false : true,
      //   only sets logged in to true if the userID cookie exists, which is created when the user is logged in, and deleted when the cookie expires
    };
    console.log(this.state);
  }

  setUserId = (returnedUserId) => {
    Cookies.set("USER_ID", returnedUserId, { expires: 1 / 24 });
    this.setState({loggedIn:true});
    // Created a cookie that will expire in one hour for USER_ID
  };

  handleChanges = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    console.log(name, value);
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

    fetch(GLOBALS.serverURL.concat("login/"), requestOptions)
      .then((response) => response.json())
      .then((data) => this.setUserId(data.UserId));
    //   .then((data) => {GlobalVars.setUserId(data.UserId); console.log(data.UserId, GlobalVars.getUserId())});
  };

  render() {
    return (
      <div id="page">
        <main>
          {this.state.loggedIn === false ? (
            <div>
              <h2>Login</h2>
              <form onSubmit={this.handleSubmit} class="form">
                <div class="form-input">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    name="username"
                    onChange={this.handleChanges}
                    placeholder="Username"
                  />
                </div>
                <div class="form-input">
                  <label htmlFor="password">Password</label>
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
            </div>
          ) : (
            <WelcomePage />
          )}
        </main>
      </div>
    );
  }
}

export default Home;
