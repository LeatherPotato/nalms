import React, { useState, useEffect } from "react";
import "../App.css";
import BookSearchElement from "../components/book_search";
import GLOBALS from "../Global";

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
        <BookSearchElementWithGenres />
        <Borrowing />
        <Lates />
        <HoldRequests />
      </div>
    );
  }
}

export default Circulation;
