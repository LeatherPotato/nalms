import React, { useState, useEffect } from "react";
import "../App.css";
import GLOBALS from "../Global";
import BookElement from "./book_element";

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
      username: ""
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let GetUsersRequest = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        schoolYear: this.state.schoolYear,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        username: this.state.username
      })
    }
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
            // USER ELEMENT
          )
        }
        this.setState({userElements: newUserElements})
        console.log("USER ELEMENTS");
        console.log(this.state.userElements)
    })
      // .then(() => {
      //   let newBookElements = [];
      //   for (let index = 0; index < this.state.books.length; index++) {
      //     let book = this.state.books[index];
      //     newBookElements.push(
      //       <BookElement
      //         bookId={book["BookId"]}
      //         availability={book["Availability"]}
      //         isbn={book["ISBN"]}
      //         title={book["Title"]}
      //         description={book["Description"]}
      //         genreName={book["GenreName"]}
      //         authorName={book["AuthorName"]}
      //         publisherName={book["PublisherName"]}
      //         publicationDate={book["PublicationDate"]}
      //         coverImage={book["CoverImage"]}
      //       />
      //     ));
        .catch((err) => alert(err));
  }
}

export default UserSearchElement;
