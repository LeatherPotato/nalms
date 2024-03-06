import React, { useEffect, useState } from "react";
import "../App.css";
import GLOBALS from "../Global";
import defaultProfilePic from "../images/defaultProfilePic.png";
import Cookies from "js-cookie";
console.log("USER_ID:");
console.log(Cookies.get("USER_ID"));

const Preferences = () => {
  const [userData, setUserData] = useState({});
  const UserInfoRequestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: Cookies.get("USER_ID"),
    }),
  };
  useEffect(() => {
    fetch(GLOBALS.serverURL.concat("/get_user/"), UserInfoRequestOptions)
      .then((response) => response.json())
      .then((data) => setUserData(data))
      .catch((err) => console.log(err));
  }, []);
  console.log(userData);

  // https://stackoverflow.com/questions/55484033/reactjs-how-to-call-useeffect-hook-only-once-to-fetch-api-data
  // FIXED ISSUE: it sent multiple requests

  return (
    <div id="accountPreferencesElement">
      <h1>Preferences</h1>
      <div id="userPreferences">
        <div>
          <img src={defaultProfilePic} alt="" />
        </div>
        <div>
          <span style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ margin: "0", padding: "0" }}>User Info</h3>
            <span class="material-symbols-outlined iconButton">edit</span>
          </span>
          <div id="display-user-info">
            <p>
              Name: {userData.FirstName} {userData.LastName}
            </p>
            <p>Username: {userData.Username}</p>
            <p>Password: **********</p>
            <p>Email: {userData.Email}</p>
            <p>School-Year: {userData.Schoolyear}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationElement = (props) => {
  const {
    notificationContent,
    notificationDate,
    notificationType,
    notificationRead,
  } = props;
  let notificationReadClass =
    notificationRead == 0
      ? "NotificationElementRead"
      : "notificationElementUnread";
  return (
    <div className={"NotificationElement ".concat(notificationReadClass)}>
      <h6>
        {notificationDate} : {notificationType}
      </h6>
      <p>{notificationContent}</p>
    </div>
  );
};

const Notifications = () => {
  // const [notifications, setNofications] = useState({});
  // const NotificationsRequestOptions = {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     userId: Cookies.get("USER_ID"),
  //   }),
  // };
  // useEffect(() => {
  //   fetch(GLOBALS.serverURL.concat("/get_notifications/"), NotificationsRequestOptions)
  //     .then((response) => response.json())
  //     .then((data) => setNofications(data))
  //     .catch((err) => console.log(err));
  // }, []);
  // console.log(notifications);
  // TODO: RENDER WHEN YOU HAVE CREATED SOME NOTIFICATIONS.
  return (
    <div id="accountNotificationsElement">
      <h1>Notifications</h1>
      <p>TODO: RENDER NOTIFICATIONS WHEN YOU HAVE CREATED SOME NOTIFICATIONS.</p>
    </div>
  );
};

const BorrowingHistory = () => {
  // TODO: WRITE DATABASE FUNCTIONS FOR THIS IF YOU HAVE THE TIME.
  return (
    <div id="accountBorrowingHistoryElement">
      <h1>Borrowing History Element</h1>
      <p>To-Be-Written</p>
    </div>
  );
};

class Account extends React.Component {
  render() {
    return (
      <div id="page">
        <Preferences />
        <Notifications />
        <BorrowingHistory />
      </div>
    );
  }
}

export default Account;
