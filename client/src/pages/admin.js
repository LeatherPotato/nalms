import React from "react";
import "../App.css";
import { Chart } from "react-google-charts";
import UserSearchElement from "../components/users_search";
import Cookies from "js-cookie";
import GLOBALS from "../Global";

import UserElement from "../components/user_element";

const isAlphabetic = (input) => {
  // https://stackoverflow.com/a/336220
  // used this stackoverflow thread to get the regex for only alphanumeric and underscores
  // i modified it to only do lowercase characters and underscores
  // i must also check if the length of the input is greater than 0, otherwise it isnt a valid input
  let regex = /^[A-Za-z]+$/;
  return regex.test(input) && input.length > 0;
};

const containsDigit = (input) => {
  let regex = /[0-9]+/gm;
  return regex.test(input);
};

const containsUppercase = (input) => {
  // i must also check if the length of the input is greater than 0, otherwise it isnt a valid input
  let regex = /[A-Z]+/gm;
  return regex.test(input);
};

const conntainsLowercase = (input) => {
  let regex = /[a-z]+/gm;
  return regex.test(input);
};

const isValidLength = (input) => {
  let regex = /.{8,}/gm;
  return regex.test(input);
};

const isValidEmail = (input) => {
  // copied RFC2822 email format regex
  // source https://regex-generator.olafneumann.org/?sampleText=email1091%40gmil.com&flags=P&selection=0%7CRFC2822%20e-mail
  let regex =
    /[-A-Za-z0-9!#$%&'*+\/=?^_`{|}~]+(?:\.[-A-Za-z0-9!#$%&'*+\/=?^_`{|}~]+)*@(?:[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?/;
  return regex.test(input);
};

const isvalidUsername = (input) => {
  // https://stackoverflow.com/a/336220
  // used this stackoverflow thread to get the regex for only alphanumeric and underscores
  // i modified it to only do lowercase characters and underscores
  let regex = /^[a-z_]+$/;
  return regex.test(input);
};

const Dashboard = () => {
  const placeholderData = [
    ["Year", "Total Books Borrowed"],
    ["Y7", 15],
    ["Y8", 39],
    ["Y9", 27],
    ["Y10", 12],
    ["Y11", 7],
    ["Y12", 31],
    ["Y13", 17],
  ];

  const options = {
    title: "Books Borrowed Per Yeargroup",
    backgroundColor: "",
  };
  return (
    <div id="adminDashboardElement">
      <h1>Dashboard Element</h1>
      <em className="importantNotice">
        Notice: this is only a placeholder for what the pie chart will look
        like. I have not written the back-end code to display this yet.
      </em>
      <Chart
        className="dashboardChart"
        chartType="PieChart"
        data={placeholderData}
        options={options}
        width={"100%"}
        height={"400px"}
      />
    </div>
  );
};

class CreateUser extends React.Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      firstNameValid: false,
      lastName: "",
      lastNameValid: false,
      password: "",
      passwordDigitValid: false,
      passwordUppercaseValid: false,
      passwordLowercaseValid: false,
      passwordLengthValid: false,
      username: "",
      usernameValid: false,
      schoolYear: "",
      email: "",
      emailValid: false,
      perms: "",
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // i am validating all of my inputs to ensure that the user is sending in the correct/required data
    let validPassword =
      this.state.passwordDigitValid &&
      this.state.passwordLengthValid &&
      this.state.passwordLowercaseValid &&
      this.state.passwordUppercaseValid;
    // console.log("PASSWORD", validPassword)
    if (
      this.state.firstNameValid &&
      this.state.lastNameValid &&
      this.state.emailValid &&
      this.state.usernameValid &&
      validPassword
    ) {
      let CreateUserRequestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderUserId: Cookies.get("USER_ID"),
          fisrtName: this.state.firstName,
          lastName: this.state.lastName,
          schoolYear: this.state.schoolYear,
          username: this.state.username,
          userPerms: this.state.perms,
          email: this.state.email,
          password: this.state.password,
        }),
      };
      fetch(GLOBALS.serverURL.concat("/create_user/"), CreateUserRequestOptions)
        .then((response) => response.json())
        .then((data) => alert("USER CREATED:", data))
        .catch((err) => alert(err));
    } else {
      alert(
        "validation imput not met. ensure all of the conditions are in green"
      );
    }
  };

  handleChanges = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({ [name]: value });
    // this.setState({ [name]: value });
    switch (name) {
      // for all of these switch statements, i only set them to true or false if they were a different value to what they should be
      // for example, if the firstname is valid, and the firstNameValid state is true, then it doesnt change anything
      // but if it is true, and the state is not, then it sets it to true (and vice versa)
      case "firstName":
        if (isAlphabetic(value) !== this.state.firstNameValid) {
          this.setState({ firstNameValid: isAlphabetic(value) });
        }
        break;
      case "lastName":
        if (isAlphabetic(value) !== this.state.lastNameValid) {
          this.setState({ lastNameValid: isAlphabetic(value) });
        }
        break;
      case "password":
        // for this block, i will be checking each of the individual conditions i have in my state, and set them accordingly
        // it will only change the value to true or false if it is the opposite of what it should be
        if (containsDigit(value) !== this.state.passwordDigitValid) {
          this.setState({ passwordDigitValid: containsDigit(value) });
        }
        if (containsUppercase(value) !== this.state.passwordUppercaseValid) {
          this.setState({ passwordUppercaseValid: containsUppercase(value) });
        }
        if (conntainsLowercase(value) !== this.state.passwordLowercaseValid) {
          this.setState({ passwordLowercaseValid: conntainsLowercase(value) });
        }
        if (isValidLength(value) !== this.state.passwordLengthValid) {
          this.setState({ passwordLengthValid: isValidLength(value) });
        }
        break;
      case "username":
        if (isvalidUsername(value) !== this.state.usernameValid) {
          this.setState({ usernameValid: isvalidUsername(value) });
        }
        break;
      case "email":
        if (isValidEmail(value) !== this.state.emailValid) {
          this.setState({ emailValid: isValidEmail(value) });
        }
        break;
      default:
        this.setState({ [name]: value });
    }
    console.log(name, value);
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} className="form">
          <div className="formInput">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={this.handleChanges}
            ></input>
            <ul>
              <li
                className={
                  "formValidation ".concat(this.state.firstNameValid
                    ? "validationTrue"
                    : "validationFalse")
                }
              >
                Alphabetic
              </li>
            </ul>
          </div>
          <div className="formInput">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={this.handleChanges}
            ></input>
            <ul>
              <li
                className={
                  "formValidation ".concat(this.state.lastNameValid
                    ? "validationTrue"
                    : "validationFalse")
                }
              >
                Alphabetic
              </li>
            </ul>
          </div>
          <div className="formInput">
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={this.handleChanges}
            ></input>
            <ul>
              <li
                className={
                  "formValidation ".concat(this.state.usernameValid
                    ? "validationTrue"
                    : "validationFalse")
                }
              >
                Valid Username
              </li>
            </ul>
          </div>
          <div className="formInput">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.handleChanges}
            ></input>
            <ul>
              <li
                className={
                  "formValidation ".concat(this.state.passwordDigitValid
                    ? "validationTrue"
                    : "validationFalse")
                }
              >
                Contains Digit
              </li>
              <li
                className={
                  "formValidation ".concat(this.state.passwordLengthValid
                    ? "validationTrue"
                    : "validationFalse")
                }
              >
                8+ Characters Long
              </li>
              <li
                className={
                  "formValidation ".concat(this.state.passwordUppercaseValid
                    ? "validationTrue"
                    : "validationFalse")
                }
              >
                Contains Uppercase
              </li>
              <li
                className={
                  "formValidation ".concat(this.state.passwordLowercaseValid
                    ? "validationTrue"
                    : "validationFalse")
                }
              >
                Contains Lowercase
              </li>
            </ul>
          </div>
          <div className="formInput">
            <input
              type="text"
              name="email"
              placeholder="Email"
              onChange={this.handleChanges}
            ></input>
            <ul>
              <li
                className={
                  "formValidation ".concat(this.state.emailValid ? "validationTrue" : "validationFalse")
                }
              >
                Valid Email
              </li>
            </ul>
          </div>
          <div className="formInput">
            <span>School Year</span>
            <select name="schoolYear" onChange={this.handleChanges}>
              <option value="7">Year 7</option>
              <option value="8">Year 8</option>
              <option value="9">Year 9</option>
              <option value="10">Year 10</option>
              <option value="11">Year 11</option>
              <option value="12">Year 12</option>
              <option value="13">Year 13</option>
            </select>
          </div>
          <div className="formInput">
            <span>Permissions</span>
            <select name="perms" onChange={this.handleChanges}>
              <option value="0000">None</option>
              <option value="0001">Hold Requests</option>
              <option value="0010">Circulation Manager</option>
              <option value="0100">Catalogue Manager</option>
              <option value="1000">Admin</option>
            </select>
          </div>
          <div>
            <button name="submitButton">Create User</button>
          </div>
        </form>
      </div>
    );
  }
}

class ChangeUserPassword extends React.Component {
  constructor() {
    super();
    this.state = {
      password: "",
      passwordDigitValid: false,
      passwordUppercaseValid: false,
      passwordLowercaseValid: false,
      passwordLengthValid: false,
      userId: -1,
      retrievedUser: {},
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // i am validating all of my inputs to ensure that the user is sending in the correct/required data
    let validPassword =
      this.state.passwordDigitValid &&
      this.state.passwordLengthValid &&
      this.state.passwordLowercaseValid &&
      this.state.passwordUppercaseValid;
    if (this.state.userId==="" || validPassword===false) {
      alert("invalid inputs")
    }
    else {
      let ChangePasswordRequestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderUserId: Cookies.get("USER_ID"),
          userId: this.state.userId,
          password: this.state.password
        }),
      };
      fetch(GLOBALS.serverURL.concat("/change_password/"), ChangePasswordRequestOptions)
        .then((response) => response.json())
        .then((data) => alert(data))
        .catch((err) => {
          alert(err)
        });
    }
    // add validation to ensure that a request with wjmpoty data is not sent
  };

  handleChanges = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({ [name]: value });
    switch (name) {
      case "password":
        // for this block, i will be checking each of the individual conditions i have in my state, and set them accordingly
        // it will only change the value to true or false if it is the opposite of what it should be
        if (containsDigit(value) !== this.state.passwordDigitValid) {
          this.setState({ passwordDigitValid: containsDigit(value) });
        }
        if (containsUppercase(value) !== this.state.passwordUppercaseValid) {
          this.setState({ passwordUppercaseValid: containsUppercase(value) });
        }
        if (conntainsLowercase(value) !== this.state.passwordLowercaseValid) {
          this.setState({ passwordLowercaseValid: conntainsLowercase(value) });
        }
        if (isValidLength(value) !== this.state.passwordLengthValid) {
          this.setState({ passwordLengthValid: isValidLength(value) });
        }
        break;
      case "userId":
        if (value=="") {
          this.setState({userId:-1})
        } else {
          this.setState({userId: value})
          let GetUserRequestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: value,
            }),
          };
          fetch(GLOBALS.serverURL.concat("/get_user/"), GetUserRequestOptions)
            .then((response) => response.json())
            .then((data) => {
              this.setState({ retrievedUser: data });
            })
            .catch((err) => {
              this.setState({ borrowUser: {} });
              alert(err)
            });
        }
        break;
      default:
        console.log("")
    }
    console.log(name, value);
    // add that validation thing where its -1 if its empoty
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          this is a form
          <div className="formInput">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.handleChanges}
            ></input>
            <ul>
              <li
                className={
                  "formValidation ".concat(this.state.passwordDigitValid
                    ? "validationTrue"
                    : "validationFalse")
                }
              >
                Contains Digit
              </li>
              <li
                className={
                  "formValidation ".concat(this.state.passwordLengthValid
                    ? "validationTrue"
                    : "validationFalse")
                }
              >
                8+ Characters Long
              </li>
              <li
                className={
                  "formValidation ".concat(this.state.passwordUppercaseValid
                    ? "validationTrue"
                    : "validationFalse")
                }
              >
                Contains Uppercase
              </li>
              <li
                className={
                  "formValidation ".concat(this.state.passwordLowercaseValid
                    ? "validationTrue"
                    : "validationFalse")
                }
              >
                Contains Lowercase
              </li>
            </ul>
          </div>
          <div class="formInput">
            <input
                type="text"
                name="userId"
                placeholder="User Id"
                onChange={this.handleChanges}
              ></input>
          </div>
          <button name="submitButton">Change Username</button>
        </form>
        {this.state.borrowUserId !== "" ? (
          // this displays the user if it has been retrieved, otherwise, it wont display anything since the user is still its initial value (an empty object {})
          <UserElement
            userId={this.state.retrievedUser["UserId"]}
            username={this.state.retrievedUser["Username"]}
            schoolYear={this.state.retrievedUser["Schoolyear"]}
            firstName={this.state.retrievedUser["FirstName"]}
            lastName={this.state.retrievedUser["LastName"]}
            permissions={this.state.retrievedUser["Permission"]}
            email={this.state.retrievedUser["Email"]}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}


class ChangeUserUsername extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      usernameValid: false,
      userId: -1,
      retrievedUser: {},
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.userId==="" || this.state.usernameValid===false) {
      alert("invalid inputs")
    }
    else {
      let ChangeUsernameRequestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderUserId: Cookies.get("USER_ID"),
          userId: this.state.userId,
          username: this.state.username,
        }),
      };
      fetch(GLOBALS.serverURL.concat("/change_username/"), ChangeUsernameRequestOptions)
        .then((response) => response.json())
        .then((data) => alert(data))
        .catch((err) => {
          alert(err)
        });
    }
    // add validation to ensure that a request with wjmpoty data is not sent
  };

  handleChanges = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({ [name]: value });
    switch (name) {
      case "username":
        if (isvalidUsername(value) !== this.state.usernameValid) {
          this.setState({ usernameValid: isvalidUsername(value) });
        }
        break;
      case "userId":
        if (value=="") {
          this.setState({userId:-1})
        } else {
          this.setState({userId: value})
          let GetUserRequestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: value,
            }),
          };
          fetch(GLOBALS.serverURL.concat("/get_user/"), GetUserRequestOptions)
            .then((response) => response.json())
            .then((data) => {
              this.setState({ retrievedUser: data });
            })
            .catch((err) => {
              this.setState({ borrowUser: {} });
              alert(err)
            });
        }
        break;
      default:
        console.log("")
    }
    console.log(name, value);
    // add that validation thing where its -1 if its empoty
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          this is a form
          <div className="formInput">
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={this.handleChanges}
            ></input>
            <ul>
              <li
                className={
                  "formValidation ".concat(this.state.usernameValid
                    ? "validationTrue"
                    : "validationFalse")
                }
              >
                Valid Username
              </li>
            </ul>
          </div>
          <div class="formInput">
            <input
                type="text"
                name="userId"
                placeholder="User Id"
                onChange={this.handleChanges}
              ></input>
          </div>
          <button name="submitButton">Change Username</button>
        </form>
        {this.state.borrowUserId !== "" ? (
          // this displays the user if it has been retrieved, otherwise, it wont display anything since the user is still its initial value (an empty object {})
          <UserElement
            userId={this.state.retrievedUser["UserId"]}
            username={this.state.retrievedUser["Username"]}
            schoolYear={this.state.retrievedUser["Schoolyear"]}
            firstName={this.state.retrievedUser["FirstName"]}
            lastName={this.state.retrievedUser["LastName"]}
            permissions={this.state.retrievedUser["Permission"]}
            email={this.state.retrievedUser["Email"]}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

const Users = () => {
  return (
    <div id="adminUsersElement">
      <h1>Users Element</h1>
      <h2>Search For Desired User</h2>
      <UserSearchElement />
      <h2>Create User</h2>
      <CreateUser />
      <h2>Change Password</h2>
      <ChangeUserPassword />
      <h2>Change Username</h2>
      <ChangeUserUsername />
    </div>
  );
};

class Admin extends React.Component {
  render() {
    return (
      <div id="page">
        <Dashboard />
        <Users />
      </div>
    );
  }
}

export default Admin;
