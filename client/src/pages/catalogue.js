import React from "react";
import "../App.css";
import BookSearchElement from '../components/book_search'

const  Search = () => {
    return (
        <div id="catalogueSearchElement">
            <h1>Search Element</h1>
            <BookSearchElement />
        </div>
    );
};

const Manage = () => {
    return (
        <div id="catalogueManageElement">
            <h1>Manage Element</h1>
            <p>content goes here</p>
        </div>
    );
};

const Locate = () => {
    return (
        <div id="catalogueLocateElement">
            <h1>Locate Element</h1>
            <p>content goes here</p>
        </div>
    );
};

class Catalogue extends React.Component {
  render() {
    return (
      <div id="page">
        <p>HIIII</p>
        <Search />
        <Manage />
        <Locate />
      </div>
    );
  }
}

export default Catalogue;
