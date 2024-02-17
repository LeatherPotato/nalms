CREATE TABLE IF NOT EXISTS BORROWS (
    UserId INTEGER NOT NULl REFERENCES USERS(UserId),
    BookId INTEGER NOT NULL REFERENCES BOOKS(BookId),
    DateBorrowed TEXT NOT NULL,
    DateReturned TEXT,
    PRIMARY KEY ( UserId, BookId)
);
