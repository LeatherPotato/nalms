import React, { useState, useEffect } from "react";
import "../App.css";
import GLOBALS from "../Global";
import BookElement from "./book_element";

// let searchConditions = {
//   isbn: -1,
//   title: "",
//   availability: -1,
//   genreId: -1,
//   sortBy: null,
//   ascending: true,
//   page: 1,
// };

let LastSelectedGenre = null;

// const BookElement = (props) => {
//   // let showExtra = false;
//   const [showExtra, setShowExtra] = useState(false);
//   const {
//     bookId,
//     availability,
//     isbn,
//     title,
//     genreName,
//     publicationDate,
//     description,
//     coverImage,
//     authorName,
//     publisherName,
//   } = props;

//   return (
//     <div
//       className={"listObject"
//         .concat(availability == 1 ? " bookAvailable" : " bookUnavailable")
//         .concat(showExtra === true ? " objectShowExtra" : " objectHideExtra")}
//     >
//       <img src={coverImage} className="listObjectPic" alt="Cover Unavailable" />
//       <div className="listObjectInfo">
//         <h3 className="listObjectName">{title}</h3>
//         <span>{authorName}</span>
//         <span>{genreName}</span>
//         <span>
//           Actions
//           <span
//             class="material-symbols-outlined iconButton"
//             onClick={() => {
//               navigator.clipboard.writeText(bookId);
//               //   https://stackoverflow.com/questions/39501289/in-reactjs-how-to-copy-text-to-clipboard
//               // USED THIS THREAD
//             }}
//           >
//             content_copy
//           </span>
//           {showExtra === false ? (
//             <span
//               class="material-symbols-outlined iconButton"
//               onClick={() => {
//                 setShowExtra(true);
//               }}
//             >
//               expand_more
//             </span>
//           ) : (
//             <span
//               class="material-symbols-outlined iconButton"
//               onClick={() => {
//                 setShowExtra(false);
//               }}
//             >
//               expand_less
//             </span>
//           )}
//         </span>
//         {showExtra === true ? <span>ISBN: {isbn}</span> : ""}
//         {showExtra === true ? (
//           <span>
//             {publisherName}, <i>{publicationDate}</i>
//           </span>
//         ) : (
//           ""
//         )}
//         {showExtra === true ? (
//           <span className="objectDescription">{description}</span>
//         ) : (
//           ""
//         )}
//       </div>
//     </div>
//   );
// };

// const genreOptions = (genres) => {
//   console.log("GENRE OPTIONS FUNCT START")
//   // console.log(genres)
//   let returnGenreOptions = [<option value={-1}>ANY</option>];
//   for (let index = 0; index < genres.length; index++) {
//     let genre = genres[index]
//     // console.log(genre)
//     returnGenreOptions.push(<option value={genre.GenreId}>{genre.GenreName}</option>)
//   }
//   // console.log(returnGenreOptions)
//   // console.log("GENRE OPTIONS FUNCT END")
//   return returnGenreOptions;
// }
// ISSUE: this returns nothing because genres is still a promise while fetching data, instead of an array of genres
// used this stackoverflow thread to only render the BookSearchElement component after data is fetched from server
// https://stackoverflow.com/questions/73420440/how-do-i-render-a-react-component-only-after-a-state-is-set
// and then this stackoverflow thread to pass the genres as a prop into BookSearchElement

class BookSearchElement extends React.Component {
  // https://legacy.reactjs.org/docs/forms.html
  // USED REACT DOCUMENTATON TO CREATE FORM
  constructor(props) {
    super(props);
    this.state = {
      searched: false,
      // search conditions
      isbn: -1,
      title: "",
      availability: -1,
      genreId: -1,
      ascending: true,
      page: 0,
      // end search conditions
      books: {},
      bookElements: [],
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let GetBooksRequestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isbn: this.state.isbn,
        title: this.state.title,
        availability: this.state.availability,
        genreId: this.state.genreId,
        ascending: this.state.ascending,
        page: this.state.page,
        sortBy: null,
      }),
    };
    fetch(GLOBALS.serverURL.concat("/get_books/"), GetBooksRequestOptions)
      .then((response) => response.json())
      .then((data) => this.setState({ books: data }))
      .then(this.setState({ searched: true }))
      .then(console.log(this.state.books))
      .then(() => {
        let newBookElements = [];
        for (let index = 0; index < this.state.books.length; index++) {
          let book = this.state.books[index];
          newBookElements.push(
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
        this.setState({ bookElements: newBookElements });
        console.log("BOOK ELEMENTS");
        console.log(this.state.bookElements);
      })
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
        <h2 class="subtitle">Filters</h2>
        <div className="objectFilters">
          <form onSubmit={this.handleSubmit}>
            <label for="title">Title</label>
            <input type="text" name="title" onChange={this.handleChanges} />
            <label for="isbn">ISBN</label>
            <input type="text" name="isbn" onChange={this.handleChanges} />
            <label for="availability">Avaialble</label>
            <select
              name="availability"
              id=""
              value={this.state.availability}
              onChange={this.handleChanges}
            >
              <option value="-1">any</option>
              <option value="1">yes</option>
              <option value="0">no</option>
            </select>
            <label for="">Genre</label>
            <select 
              value={this.state.genreId} 
              onChange={this.handleChanges} 
              name="genreId"
            >
              {genres}
            </select>

            {/* title BOOK_DATA.Title, genre GENRES.GenreName, author AUTHORS.AuthorName, publisher PUBLISHERS.PublisherName, isbn BOOK_DATA.ISBN */}
            <button name="submitButton">Search</button>
          </form>
        </div>
        <h2 class="subtitle">Results</h2>
        {this.state.searched === true ? (
          <div id="displayObjects">{this.state.bookElements}</div>
        ) : (
          <p>None Yet.</p>
        )}
      </div>
    );
  }
}


// const BookSearchElement = () => {
//   const [genres, setGenres] = useState(undefined)
  
//   useEffect(async () => {
//     // const fetchedData = await getDataFromServer()
//     // setData(fetchedData)
//     fetch(GLOBALS.serverURL.concat("/get_genres/"), {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ genreName: "", page: 0 }),
//     })
//       .then((response) => response.json())
//       .then((data) => setGenres(genreOptions(data)))
//   }, [])

//   return (
//     <div>
//       {genres ? <BookSearchElementIntermediary genres={genres} /> : <p>Loading...</p>}
//     </div>
//   )
// }

export default BookSearchElement;
