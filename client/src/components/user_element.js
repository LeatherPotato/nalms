import React, { useState } from "react";
import defaultProfilePic from "../images/defaultProfilePic.png";

const UserElement = (props) => {
  // let showExtra = false;
  const [showExtra, setShowExtra] = useState(false);
  const {
    userId,
    username,
    schoolYear,
    firstName,
    lastName,
    permissions,
    email,
  } = props;

  return (
    <div
      className="listObject"
    >
      <img
        src={defaultProfilePic}
        className="listObjectPic"
        alt="User Profile Pic Unavailable"
      />
      <div className="listObjectInfo">
        <h3 className="listObjectName">
          {firstName} {lastName}
        </h3>
        <span>
          {username}, {email}
        </span>
        <span>Permissions {permissions}</span>
        <span>Year {schoolYear}</span>
        <span>
          Copy UserId, Email
          <span
            class="material-symbols-outlined iconButton"
            onClick={() => {
              navigator.clipboard.writeText(userId);
            }}
          >
            content_copy
          </span>
          <span
            class="material-symbols-outlined iconButton"
            onClick={() => {
              navigator.clipboard.writeText(email);
            }}
          >
            content_copy
          </span>
        </span>
      </div>
    </div>
  );
};

export default UserElement;
