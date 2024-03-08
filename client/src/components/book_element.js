import React, { useState } from "react";

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
        className={"listObject"
          .concat(availability == 1 ? " bookAvailable" : " bookUnavailable")
          .concat(showExtra === true ? " objectShowExtra" : " objectHideExtra")}
      >
        <img src={coverImage} className="listObjectPic" alt="Cover Unavailable" />
        <div className="listObjectInfo">
          <h3 className="listObjectName">{title}</h3>
          <span>{authorName}</span>
          <span>{genreName}</span>
          <span>
            Actions
            <span
              class="material-symbols-outlined iconButton"
              onClick={() => {
                navigator.clipboard.writeText(bookId);
                //   https://stackoverflow.com/questions/39501289/in-reactjs-how-to-copy-text-to-clipboard
                // USED THIS THREAD
              }}
            >
              content_copy
            </span>
            {showExtra === false ? (
              <span
                class="material-symbols-outlined iconButton"
                onClick={() => {
                  setShowExtra(true);
                }}
              >
                expand_more
              </span>
            ) : (
              <span
                class="material-symbols-outlined iconButton"
                onClick={() => {
                  setShowExtra(false);
                }}
              >
                expand_less
              </span>
            )}
          </span>
          {showExtra === true ? <span>ISBN: {isbn}</span> : ""}
          {showExtra === true ? (
            <span>
              {publisherName}, <i>{publicationDate}</i>
            </span>
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

export default BookElement;