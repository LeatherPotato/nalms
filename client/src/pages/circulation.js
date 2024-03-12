import React, { useState, useEffect } from "react";
import "../App.css";
import BookSearchElement from "../components/book_search";
import GLOBALS from "../Global";
import UserSearchElement from "../components/users_search";
import Cookies from "js-cookie";

import BookElement from "../components/book_element";
import UserElement from "../components/user_element";

const genreOptions = (genres) => {
  console.log("GENRE OPTIONS FUNCT START");
  // console.log(genres)
  let returnGenreOptions = [<option value="-1">ANY</option>];
  for (let index = 0; index < genres.length; index++) {
    let genre = genres[index];
    // console.log(genre)
    returnGenreOptions.push(
      <option value={genre.GenreName}>{genre.GenreName}</option>
    );
  }
  // console.log(returnGenreOptions)
  // console.log("GENRE OPTIONS FUNCT END")
  return returnGenreOptions;
};

const BookSearchElementWithGenres = () => {
  const [genres, setGenres] = useState(undefined);

  useEffect(async () => {
    fetch(GLOBALS.serverURL.concat("/get_genres/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ genreName: "", page: 0 }),
    })
      .then((response) => response.json())
      .then((data) => setGenres(genreOptions(data)));
  }, []);

  return (
    <div>
      {genres ? (
        <div id="catalogueSearchElement">
          <h1>Search For Desired Book</h1>
          <BookSearchElement genres={genres} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

class Borrowing extends React.Component {
  render() {
    return (
      <div id="cicrulationBorrowingElement">
        <h1>Borrowing Element</h1>
        {/* so basically you want to make a form here to get the books borrowed by userid and bookid, pick one, and then either return or borrow it. that last bit should be done with a ternary operator */}
        <h2 class="subtitle">Borrow</h2>
        <h2 class="subtitle">Return</h2>
      </div>
    );
  }
}

const Lates = () => {
  return (
    <div id="circulationLatesElement">
      <h1>Lates Element</h1>
      <p>content goes here</p>
    </div>
  );
};

const HoldRequestElement = (props) => {
  const { userId, bookId } = props;
  return (
    <div>
      <p>
        Requested By: {userId}, Book Id: {bookId}
      </p>
    </div>
  );
};

class HoldRequests extends React.Component {
  constructor() {
    super();
    this.state = {
      // state for hold request getting/displaying form
      holdRequestElements: [],

      // state for
      createFormUserId: -1,
      createFormBookId: -1,
      createFormBook: {},
      createFormUser: {},

      // state for hold request removing form
      removeFormUserId: -1,
      removeFormBookId: -1,
      removeFormBook: {},
      removeFormUser: {},
    };
  }

  handleHoldRequestsGet = (e) => {
    e.preventDefault();
    let HoldRequestsGetOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    };
    fetch(
      GLOBALS.serverURL.concat("/get_hold_requests/"),
      HoldRequestsGetOptions
    )
      .then((response) => response.json())
      .then((data) => {
        // loops through the returned data to create hold request elements
        console.log(data);
        let holdRequestElementsList = [];
        for (let index = 0; index < data.length; index++) {
          const holdRequest = data[index];
          console.log(holdRequest);
          holdRequestElementsList.push(
            <HoldRequestElement
              userId={holdRequest["UserId"]}
              bookId={holdRequest["BookId"]}
            />
          );
        }
        // console.log(holdRequestElementsList);
        this.setState({ holdRequestElements: holdRequestElementsList });
      });
  };

  handleHoldRequestCreate = (e) => {
    e.preventDefault();
    if (
      this.state.createFormBookId === -1 ||
      this.state.createFormUserId === -1
    ) {
      alert("ERROR: DATA NOT ENTERED CORRECTLY");
    } else {
      let holdRequestCreateOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderUserId: Cookies.get("USER_ID"),
          userId: this.state.createFormUserId,
          bookId: this.state.createFormBookId,
        }),
      };
      fetch(
        GLOBALS.serverURL.concat("/create_hold_request/"),
        holdRequestCreateOptions
      )
        .then((response) => response.json())
        .then((data) => alert(data))
        .catch((err) => alert(err));
    }
  };

  handleHoldRequestDelete = (e) => {
    e.preventDefault();
    if (
      this.state.createFormBookId === -1 ||
      this.state.removeFormUserId === -1
    ) {
      alert("ERROR: DATA NOT ENTERED CORRECTLY");
    } else {
      let holdRequestCreateOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderUserId: Cookies.get("USER_ID"),
          userId: this.state.removeFormUserId,
          bookId: this.state.removeFormBookId,
        }),
      };
      fetch(
        GLOBALS.serverURL.concat("/remove_hold_request/"),
        holdRequestCreateOptions
      )
        .then((response) => response.json())
        .then((data) => alert(data))
        .catch((err) => alert(err));
    }
  };

  handleChanges = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({ [name]: value === "" ? -1 : value });
    // validation in line above: needed to check if the user inputted a value before sending it off, otherwise, it resets to -1
    // need to check of the value is not null so that it doesnt try to get a book or user with an empty id and refresh, meaning it only refreshes the book or user element when a new valid id is added
    if (name === "createFormBookId" && value !== "") {
      let GetBookRequestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: value,
        }),
      };
      fetch(GLOBALS.serverURL.concat("/get_book/"), GetBookRequestOptions)
        .then((response) => response.json())
        .then((data) => this.setState({ createFormBook: data[0] }))
        // .then(console.log(this.state))
        .catch((err) => {
          this.setState({ createFormBook: {} });
        });
    } else if (name === "removeFormBookId" && value !== "") {
      let GetBookRequestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: value,
        }),
      };
      fetch(GLOBALS.serverURL.concat("/get_book/"), GetBookRequestOptions)
        .then((response) => response.json())
        .then((data) => this.setState({ removeFormBook: data[0] }))
        .catch((err) => {
          this.setState({ book: {} });
        });
    } else if (name === "createFormUserId" && value !== "") {
      let GetBookRequestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: value,
        }),
      };
      fetch(GLOBALS.serverURL.concat("/get_user/"), GetBookRequestOptions)
        .then((response) => response.json())
        .then((data) => {
          this.setState({ createFormUser: data });
        })
        // .then(console.log(this.state))
        .catch((err) => {
          this.setState({ createFormUser: {} });
        });
    } else if (name === "removeFormUserId" && value !== "") {
      let GetBookRequestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: value,
        }),
      };
      fetch(GLOBALS.serverURL.concat("/get_user/"), GetBookRequestOptions)
        .then((response) => response.json())
        .then((data) => this.setState({ removeFormUser: data }))
        .catch((err) => {
          this.setState({ book: {} });
        });
    }
  };

  render() {
    return (
      <div id="circulationHoldRequestsElement">
        <h1>Hold-Requests Element</h1>
        <h2 class="subtitle">Find Hold Request</h2>
        <form onSubmit={this.handleHoldRequestsGet}>
          <button name="submitButton">Get Hold-Requests</button>
        </form>
        {this.state.holdRequestElements === [] ? (
          ""
        ) : (
          <div>
            <h3>Retrieved</h3>
            {this.state.holdRequestElements}
          </div>
        )}
        <h2 class="subtitle">Create Hold Reuest</h2>
        {/* create hold request form */}
        <form onSubmit={this.handleHoldRequestCreate}>
          <input
            type="text"
            name="createFormUserId"
            placeholder="User Id"
            onChange={this.handleChanges}
          />
          <input
            type="text"
            name="createFormBookId"
            placeholder="Book Id"
            onChange={this.handleChanges}
          />
          <button name="submitButton">Create!</button>
        </form>
        {this.state.createFormBookId !== -1 ? (
          // this displays the book if it has been retrieved, otherwise, it wont display anything since the book is still its initial value (an empty object {})
          <BookElement
            bookId={this.state.createFormBook["BookId"]}
            availability={this.state.createFormBook["Availability"]}
            isbn={this.state.createFormBook["ISBN"]}
            title={this.state.createFormBook["Title"]}
            description={this.state.createFormBook["Description"]}
            genreName={this.state.createFormBook["GenreName"]}
            authorName={this.state.createFormBook["AuthorName"]}
            publisherName={this.state.createFormBook["PublisherName"]}
            publicationDate={this.state.createFormBook["PublicationDate"]}
            coverImage={this.state.createFormBook["CoverImage"]}
          />
        ) : (
          ""
        )}
        {this.state.createFormUserId !== -1 ? (
          // this displays the user if it has been retrieved, otherwise, it wont display anything since the user is still its initial value (an empty object {})
          <UserElement
            userId={this.state.createFormUser["UserId"]}
            username={this.state.createFormUser["Username"]}
            schoolYear={this.state.createFormUser["Schoolyear"]}
            firstName={this.state.createFormUser["FirstName"]}
            lastName={this.state.createFormUser["LastName"]}
            permissions={this.state.createFormUser["Permission"]}
            email={this.state.createFormUser["Email"]}
          />
        ) : (
          ""
        )}
        <h2>Delete Hold Request</h2>
        {/* delete hold requestform */}
        <form onSubmit={this.handleHoldRequestDelete}>
          <input
            type="text"
            name="removeFormUserId"
            placeholder="User Id"
            onChange={this.handleChanges}
          />
          <input
            type="text"
            name="removeFormBookId"
            placeholder="Book Id"
            onChange={this.handleChanges}
          />
          <button name="submitButton">Delete!</button>
        </form>
        {this.state.removeFormBookId !== -1 ? (
          // this displays the book if it has been retrieved, otherwise, it wont display anything since the book is still its initial value (an empty object {})
          <BookElement
            bookId={this.state.removeFormBook["BookId"]}
            availability={this.state.removeFormBook["Availability"]}
            isbn={this.state.removeFormBook["ISBN"]}
            title={this.state.removeFormBook["Title"]}
            description={this.state.removeFormBook["Description"]}
            genreName={this.state.removeFormBook["GenreName"]}
            authorName={this.state.removeFormBook["AuthorName"]}
            publisherName={this.state.removeFormBook["PublisherName"]}
            publicationDate={this.state.removeFormBook["PublicationDate"]}
            coverImage={this.state.removeFormBook["CoverImage"]}
          />
        ) : (
          ""
        )}
        {this.state.removeFormUserId !== -1 ? (
          // this displays the user if it has been retrieved, otherwise, it wont display anything since the user is still its initial value (an empty object {})
          <UserElement
            userId={this.state.removeFormUser["UserId"]}
            username={this.state.removeFormUser["Username"]}
            schoolYear={this.state.removeFormUser["Schoolyear"]}
            firstName={this.state.removeFormUser["FirstName"]}
            lastName={this.state.removeFormUser["LastName"]}
            permissions={this.state.removeFormUser["Permission"]}
            email={this.state.removeFormUser["Email"]}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

class Circulation extends React.Component {
  render() {
    return (
      <div id="page">
        <BookSearchElementWithGenres />
        <h1>Search For Desired User</h1>
        <UserSearchElement />
        <Borrowing />
        <Lates />
        <HoldRequests />
      </div>
    );
  }
}

export default Circulation;
