CREATE TABLE AUTHORS (
    AuthorId INT PRIMARY KEY ASC NOT NULL,
    AuthorIsbn TEXT,
    AuthorFirstName TEXT,
    AuthorLastName TEXT
);

CREATE TABLE PUBLISHERS (
    PublisherId INT PRIMARY KEY ASC NOT NULL,
    PublisherIsbn TEXT,
    PublisherName TEXT
);

CREATE TABLE HOLDS (
    HoldID INT PRIMARY KEY ASC NOT NULL,
    Status INT
);

CREATE TABLE LIBRARIANS (
    UserId INT PRIMARY KEY ASC NOT NULL,
    Schoolyear INT,
    FirstName TEXT,
    LastName TEXT,
    Password TEXT,
    Permissions TEXT
);

CREATE TABLE USERS (
    UserId INT PRIMARY KEY ASC NOT NULL,
    Schoolyear INT,
    FirstName TEXT,
    LastName TEXT,
    BorrowedBooks TEXT,
    Password TEXT
);

CREATE TABLE BOOKS (
    BookId INT PRIMARY KEY ASC NOT NULL,
    Title TEXT,
    AuthorID INT REFERENCES AUTHORS(AuthorId),
    ISBN TEXT,
    Genre TEXT,
    PublicationDate TEXT,
    PublisherId INT REFERENCES PUBLISHERS(PublisherId),
    Availability INTEGER,
    Description TEXT, 
    CoverImage TEXT

    -- FOREIGN KEY (AuthorID) REFERENCES AUTHORS(AuthorId),
    -- FOREIGN KEY (PublisherId) REFERENCES PUBLISHERS(PublisherId)
);

CREATE TABLE BORROWED_BOOKS (
    BorrowId INT PRIMARY KEY ASC NOT NULL,
    BorrowedBookId INT REFERENCES BOOKS(BookId),
    DueDate TEXT
    -- FOREIGN KEY (BorrowedBookId) REFERENCES BOOKS(BookId)
);  

CREATE TABLE NOTIFICATIONS (
    NotificationId INT PRIMARY KEY ASC NOT NULL,
    UserId INT REFERENCES USERS(UserId),
    NotifcationContent TEXT,
    NotificationDate TEXT,
    NotificationType INT

    -- FOREIGN KEY (UserId) REFERENCES USERS(UserId)
);