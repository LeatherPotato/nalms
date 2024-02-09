-- So i just realised that i can just quickly redo the holds table to encorporate a composite key of BookID and UserID

DROP TABLE IF EXISTS HOLDS;

CREATE TABLE IF NOT EXISTS HOLDS (
    UserId INTEGER NOT NULl,
    BookId INTEGER NOT NULL,
    Status INTEGER NOT NULL,
    PRIMARY KEY ( UserId, BookId)
);