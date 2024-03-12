import React, { useState, useEffect } from "react";
import "../App.css";
import GLOBALS from "../Global";
import UserElement from "./user_element";

class UserSearchElement extends React.Component {
  constructor() {
    super();
    this.state = {
      searched: false,
      page: 0,
      users: {},
      userElements: [],
      // USER SEARCH CONDITIONS:
      schoolYear: -1,
      firstName: "",
      lastName: "",
      username: "",
      userId: -1,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
    let GetUsersRequest = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        schoolYear: this.state.schoolYear,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        username: this.state.username,
        sortBy: null,
        ascending: true,
        page: 0,
        userId: this.state.userId,
      }),
    };
    fetch(GLOBALS.serverURL.concat("/get_users/"), GetUsersRequest)
      .then((response) => response.json())
      .then((data) => this.setState({ users: data }))
      .then(this.setState({ searched: true }))
      .then(console.log(this.state.users))
      .then(() => {
        let newUserElements = [];
        for (let index = 0; index < this.state.users.length; index++) {
          let user = this.state.users[index];
          newUserElements.push(
            <UserElement
              userId={user["UserId"]}
              username={user["Username"]}
              schoolYear={user["Schoolyear"]}
              firstName={user["FirstName"]}
              lastName={user["LastName"]}
              permissions={user["Permissions"]}
              email={user["Email"]}
            />
          );
        }
        this.setState({ userElements: newUserElements });
        console.log("USER ELEMENTS");
        console.log(this.state.userElements);
      })
      .catch((err) => alert(err));
  };

  handleChanges = (e) => {
    // VALIDATION
    // ensured that the userid and schoolyear fields are -1 if the inputs are empty, so that the database correctly selects the intended data
    // they are integers in my backend and i have them set to -1 by default for the searching in my database
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "userId" && value === "") {
      this.setState({ [name]: -1 });
    } else if (name === "schoolYear" && value === "") {
      this.setState({ [name]: -1 });
    } else {
      this.setState({ [name]: value });
    }
    console.log(name, value);
  };

  render() {
    return (
      <div>
        <h2>Filters</h2>
        <div className="objectFilters">
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={this.handleChanges}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={this.handleChanges}
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={this.handleChanges}
            />
            <input
              type="text"
              name="userId"
              placeholder="UserId"
              onChange={this.handleChanges}
            />
            <label htmlFor="schoolYear"></label>
            <select
              name="schoolYear"
              value={this.state.schoolYear}
              onChange={this.handleChanges}
            >
              <option value="-1">ANY</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
            </select>
            <button name="submitButton">Search</button>
          </form>
        </div>
        <h2>Results</h2>
        {this.state.searched === true ? (
          <div id="displayObjects">{this.state.userElements}</div>
        ) : (
          <p>None Yet.</p>
        )}
      </div>
    );
  }
}

export default UserSearchElement;
