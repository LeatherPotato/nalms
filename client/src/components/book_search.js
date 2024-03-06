import React, { useState, useEffect } from "react";
import "../App.css";
import GLOBALS from "../Global";

let searchConditions = {
  isbn: -1,
  title: "",
  availability: -1,
  genreId: -1,
  sortBy: null,
  ascending: true,
  page: 1,
};

const BookElement = (props) => {
  // let showExtra = false;
  const [showExtra, setShowExtra] = useState(false);
  const {
    bookId,
    availability,
    isbn,
    title,
    genreName,
    publicationDate,
    description,
    coverImage,
    authorName,
    publisherName,
  } = props;

  return (
    <div
      className={"listObject".concat(
        availability == 1 ? " bookAvailable" : " bookUnavailable"
      ).concat(showExtra === true ? " objectShowExtra" : " objectHideExtra")}
    >
      <img src={coverImage} className="listObjectPic" alt="Cover Unavailable" />
      <div className="listObjectInfo">
        <h3 className="listObjectName">{title}</h3>
        <span>{authorName}</span>
        <span>{genreName}</span>
        <span>
          Actions
          <span class="material-symbols-outlined iconButton" onClick={() => {navigator.clipboard.writeText(bookId)}}>content_copy</span>
          {showExtra === false ? (
            <span class="material-symbols-outlined iconButton" onClick={() => {setShowExtra(true)}}>expand_more</span>
          ) : (
            <span class="material-symbols-outlined iconButton" onClick={() => {setShowExtra(false)}}>expand_less</span>
          )}
        </span>
        {showExtra === true ? (
          <span>ISBN: {isbn}</span>
        ) : (
          ""
        )}
        {showExtra === true ? (
          <span>{publisherName}, <i>{publicationDate}</i></span>
        ) : (
          ""
        )}
        {showExtra === true ? (
          <span className="objectDescription">{description}</span>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

const BookSearchElement = () => {
  // const [mode, setMode] = useState({});

  const [books, setBooks] = useState({});
  const GetBooksRequestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(searchConditions),
  };

  //   const [publishers, setGenres] = useState({})
  //   const getGenresRequestOptions = {
  //     method: "POST",
  //     headers: {"Content-Type": "application/json"},
  //     body: JSON.stringify({
  //         genreName: "",
  //         page: 0
  //     })
  //   }

  useEffect(() => {
    fetch(GLOBALS.serverURL.concat("/get_books/"), GetBooksRequestOptions)
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((err) => console.log(err));
  }, []);
  console.log("BOOKS");
  console.log(books);

  let bookElements = [];
  for (let index = 0; index < books.length; index++) {
    let book = books[index];
    bookElements.push(
      <BookElement
        bookId={book["BookId"]}
        availability={book["Availability"]}
        isbn={book["ISBN"]}
        title={book["Title"]}
        description={book["Description"]}
        genreName={book["GenreName"]}
        authorName={book["AuthorName"]}
        publisherName={book["PublisherName"]}
        publicationDate={book["PublicationDate"]}
        coverImage={book["CoverImage"]}
      />
    );
  }

  console.log("BOOK ELEMENTS");
  console.log(bookElements);

  return <div id="displayObjects">{bookElements}</div>;
};

export default BookSearchElement;
