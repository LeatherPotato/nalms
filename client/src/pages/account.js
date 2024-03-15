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
      .catch((err) => alert(err));
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
  let {
    notificationContent,
    notificationDate,
    notificationType,
    notificationRead,
    notificationId,
  } = props;
  let notificationReadClass =
    notificationRead === 0
      ? "NotificationElementUnread"
      : "NotificationElementRead";
  // adds a Read or Unread class to the data so that the notifications have a visual indicator of whether or not they are read

  const readNotification = () => {
    // sends read notification request to the server, with the notificationId
    const NotificationReadRequestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notificationId: notificationId,
      }),
    };
    fetch(
      GLOBALS.serverURL.concat("/read_notification/"),
      NotificationReadRequestOptions
    )
      .then((response) => response.json())
      .then((data) => alert(data))
      .then(notificationRead=1)
      // sets notificationRead to true so that it updates in the UI
      .catch((err) => alert(err));
  };

  let NotificationTypeName = "";

  //   selecting the notificationTypeName with the notificationType integer
  // so that i can display that string instead of showing the user a "meaningless" integer
  switch (notificationType) {
    case 0:
      NotificationTypeName = "Hold Request Accepted";
      break;
    case 1:
      NotificationTypeName = "Currently Borrowed Book Is Late!";
      break;
    default:
      NotificationTypeName = "Notification Type Unknown";
  }
  return (
    <div className={"NotificationElement ".concat(notificationReadClass)}>
      <h4 className="NotificationTitle">
        {NotificationTypeName}{" "}
        <span
          class="material-symbols-outlined iconButton"
          onClick={readNotification}
        >
          mark_email_read
        </span>
      </h4>
      <p>{notificationContent}</p>
      <i>Sent At {notificationDate}</i>
    </div>
  );
};

class Notifications extends React.Component {
  constructor() {
    super();
    this.state = {
      notifications: [],
      notificationElements: [],
      displayNotifications: false,
    };
  }

  getNoficiations = () => {
    const NotificationsRequestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: Cookies.get("USER_ID"),
      }),
    };
    fetch(
      GLOBALS.serverURL.concat("/get_notifications/"),
      NotificationsRequestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        // after retrieving the data, i loop through it and make a list of the NotificationElement elements
        console.log(data);
        this.setState({ notifications: data });
        let currentNotificationElements = [];
        for (let index = 0; index < data.length; index++) {
          const notification = data[index];
          // console.log(index, notification)
          currentNotificationElements.push(
            <NotificationElement
              notificationContent={notification["NotifcationContent"]}
              notificationDate={notification["NotificationDate"]}
              notificationType={notification["NotificationType"]}
              notificationRead={notification["NotificationRead"]}
              notificationId={notification["NotificationId"]}
            />
          );
        }
        this.setState({ notificationElements: currentNotificationElements });
      })
      .then(this.setState({ displayNotifications: true }))
      // i set this to true after setting notificationElements, so that they can be displayed in the ui
      .catch((err) => alert(err));
    console.log(this.state.notifications, this.state.displayNotifications);
  };

  // TODO: RENDER WHEN YOU HAVE CREATED SOME NOTIFICATIONS.
  // TODO-COMPLETE
  render() {
    return (
      <div id="accountNotificationsElement">
        <h1>Notifications</h1>
        {/* only displays notiications after the otificationget button has been clicked, otherwise it shows the getnotifications button */}
        {this.state.displayNotifications === true ? (
          <div>
            <h3>Retrieved</h3>
            {this.state.notificationElements}
          </div>
        ) : (
          <form onSubmit={this.getNoficiations}>
          <button name="submitButton">Get Notifications</button>
        </form>
        )}
      </div>
    );
  }
}

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
