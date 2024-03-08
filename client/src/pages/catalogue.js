import React, { useState, useEffect } from "react";
import "../App.css";
import BookSearchElement from "../components/book_search";
import BookElement from "../components/book_element";
import GLOBALS from "../Global";
import Cookies from "js-cookie";

// const Search = () => {
//   return (

//   );
// };

class CreationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isbn: -1,
      genre: -1,
      newGenre:"",
      bookCreated : false,
      bookId : -1,
      book: {},
    };
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state)
    let CreateBookRequestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isbn: this.state.isbn,
        genre: this.state.genre == -1 ? (this.state.newGenre) : (this.state.genre),
        senderUserId: Cookies.get('USER_ID'),
      }),
    };
    console.log(CreateBookRequestOptions.body)
    fetch(GLOBALS.serverURL.concat("/create_book/"), CreateBookRequestOptions)
      .then((response) => response.json())
      .then((data) => this.setState({bookId : data.BookId}))
      .then(fetch(GLOBALS.serverURL.concat("/get_book/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: this.state.bookId
        }),
      }))
      .then((response) => response.json())
      .then((data) => this.setState({book: data}))
      .then(this.setState({bookCreated: true}))
      .then(console.log(this.state.book))
      // TODO: FINISH THIS HANDLESUBMIT FUNCTION TO GET THE BOOK ID AND SHOW IT AND STUFF
      // TODO-COMPLETE!
      .catch((err) => alert(err));
  };

  handleChanges = (e) => {
    e.preventDefault()
    const { name, value } = e.target;
    this.setState({ [name]: value });
    console.log(name, value);
  };


  render() {
    const { genres } = this.props;
    return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <label for="isbn">ISBN</label>
            <input type="text" name="isbn" onChange={this.handleChanges}></input>
            <label></label>
            <select 
              value={this.state.genre} 
              onChange={this.handleChanges} 
              name="genre"
            >
              {genres}
            </select>
            {this.state.genre == -1 ? (<span>
              <label for="genreName">newGenreName</label>
              <input type="text" name="genreName" onChange={this.handleChanges}></input>
            </span>) : ("")}
            <button name="submitButton">Create</button>
          </form>
          {this.state.bookCreated===true? (
          <BookElement
          bookId={this.state.book["BookId"]}
          availability={this.state.book["Availability"]}
          isbn={this.state.book["ISBN"]}
          title={this.state.book["Title"]}
          description={this.state.book["Description"]}
          genreName={this.state.book["GenreName"]}
          authorName={this.state.book["AuthorName"]}
          publisherName={this.state.book["PublisherName"]}
          publicationDate={this.state.book["PublicationDate"]}
          coverImage={this.state.book["CoverImage"]}
          />) : ("")}
        </div>
    )
  };
}

const genreOptions = (genres) => {
  console.log("GENRE OPTIONS FUNCT START");
  // console.log(genres)
  let returnGenreOptions = [<option value="-1">NEW</option>];
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

class Delete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookId: -1,
      bookDeleted: false,
      book: {},
    };
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state)
    let DeleteBookRequestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookId: this.state.bookId,
        senderUserId: Cookies.get('USER_ID'),
      }),
    };
    console.log(DeleteBookRequestOptions.body)
    fetch(GLOBALS.serverURL.concat("/delete_book/"), DeleteBookRequestOptions)
      .then((response) => response.json())
      .then((data) => alert(data))
      .then(fetch(GLOBALS.serverURL.concat("/get_book/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: this.state.bookId,
        }),
      }))
      .then((response) => response.json())
      .then((data) => alert(data))
      .then(this.setState({bookCreated: true}))
      .catch((err) => alert(err));
  };

  handleChanges = (e) => {
    e.preventDefault()
    const { name, value } = e.target;
    this.setState({ [name]: value });
    console.log(name, value);
    if (name==="bookId" && value!="") {
      let GetBookRequestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: value
        }),
      };
      fetch(GLOBALS.serverURL.concat("/get_book/"), GetBookRequestOptions)
        .then((response) => response.json())
        .then((data) => this.setState({book: data[0]}))
        .then(console.log(this.state.book))
        .catch((err) => {alert(err); this.setState({book: {}})});
    }
  };


  render() {
    return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <label for="bookId">BookId</label>
            <input type="text" name="bookId" onChange={this.handleChanges}></input>
            <label></label>
            <button name="submitButton">Delete</button>
          </form>
          {this.state.bookDeleted===false? (
          <BookElement
          bookId={this.state.book["BookId"]}
          availability={this.state.book["Availability"]}
          isbn={this.state.book["ISBN"]}
          title={this.state.book["Title"]}
          description={this.state.book["Description"]}
          genreName={this.state.book["GenreName"]}
          authorName={this.state.book["AuthorName"]}
          publisherName={this.state.book["PublisherName"]}
          publicationDate={this.state.book["PublicationDate"]}
          coverImage={this.state.book["CoverImage"]}
          />) : ("")}
        </div>
    )
  };
}

const Catalogue = () => {
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
        <div id="page">
          <div id="catalogueSearchElement">
            <h1>Search For Desired Book</h1>
            <BookSearchElement genres={genres}/>
          </div>
          <div id="catalogueCreateElement">
            <h1>Create Book</h1>
            <CreationForm genres={genres}/>
          </div>
            <div id="catalogueDeleteElement">
              <h1>Delete Book</h1>
              <Delete />
            </div>
        </div>
      ) : (
        <div id="page">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};


export default Catalogue;
