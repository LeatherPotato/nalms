class Database:
    import sqlite3
    from custom_classes import Book, BookConditions, User, UserConditions
    import datetime

    def __init__(self, db_path):
        self.con = self.sqlite3.connect(db_path, check_same_thread=False)
        # print(con.total_changes)
        self.con.row_factory = self.dict_factory
        self.cur = self.con.cursor()

    def dict_factory(self, cursor, row):
        # copied from sqlite3 documentation for row factories
        d = {}
        for idx, col in enumerate(cursor.description):
            d[col[0]] = row[idx]
        return d

    def read_data(self, select_fields: list, from_field: str, where_fields: list):
        # DONE: upgrade to add multiple select fields and multiple where fields.
        self.cur.execute(f"SELECT {",".join(select_fields)} FROM {
                         from_field} WHERE {",".join(where_fields)}")
        rows = self.cur.fetchall()
        return rows

    def delete_row(self, table: str, conditions: list):
        # TODO FIX DELETE FUNCTION: IT IS CURRENTLY A VULNERABILITY
        print(table, conditions)
        self.cur.execute(f"DELETE FROM {table} WHERE {",".join(conditions)}""")
        self.con.commit()

    def check_user_permissions(self, userId, action: int):
        creatorPerms = self.cur.execute(
            """SELECT Permissions FROM USERS WHERE UserId=?""", (userId,)).fetchone()['Permissions']
        return action <= int(creatorPerms, 2)
        # TODO: will add user permission checking to all of flask code
        # todo complete!

    def create_book(self, Book: Book):
        # checks a there is an entry in BOOK_DATA with that isbn, and makes it if it does not, and then inserts a book into BOOKS with that BookDataId
        # this ensures the atomicity of the BOOK_DATA table as no 2 unique books will have the same isbn...
        # ...and the same book will not have multiple unique ISBNs unless there is a difference in the the fields i have in my database.
        bookDataPk = self.cur.execute(
            """SELECT BookDataId FROM BOOK_DATA WHERE ISBN=?""", (Book.isbn,)).fetchone()
        if bookDataPk == None:
            Book.author_id = self.create_author(Book.author_name)
            Book.genre_id = self.create_genre(Book.genre_name)
            Book.publisher_id = self.create_publisher(Book.publisher_name)
            bookDataPk = self.cur.execute("""INSERT INTO BOOK_DATA 
                (ISBN, Title, AuthorId, GenreId, PublicationDate, PublisherId, Description, CoverImage) 
                VALUES(?,?,?,?,?,?,?,?) RETURNING (BookDataId)""",
                                          (Book.isbn, Book.title, Book.author_id, Book.genre_id, Book.publication_date, Book.publisher_id, Book.description, Book.cover_image)).fetchone()
        bookId = self.cur.execute(
            """INSERT INTO BOOKS (Availability, BookDataIsbn) VALUES (1, ?) RETURNING (BookId)""", (bookDataPk['BookDataId'],)).fetchone()
        self.con.commit()
        return bookId

    def borrow_book(self, userId, bookId: int):
        # checks if book is available already, if it is, then itll send
        availability = self.cur.execute(
            """SELECT Availability FROM BOOKS WHERE BookId=?""", (bookId,)).fetchone()["Availability"]
        if availability == 1:
            time = self.datetime.datetime.now().strftime("%I:%M%p on %B %d, %Y")
            # gets the current time and data with strftime from the datetime module
            # used this stackoverflow thread
            # https://stackoverflow.com/questions/3316882/how-do-i-get-a-string-format-of-the-current-date-time-in-python
            self.cur.execute(
                """INSERT OR REPLACE INTO BORROWS (UserId, BookId, DateBorrowed) VALUES (?, ?, ?)""", (userId, bookId, time))
            self.cur.execute(
                """UPDATE BOOKS SET Availability=0 WHERE BookId=?""", (bookId,))
            self.con.commit()
            return "Book Borrowed"
        else:
            return "ERR Book Not Borrowed"

    def return_book(self, userId, bookId: int):
        time = self.datetime.datetime.now().strftime("%I:%M%p on %B %d, %Y")
        # gets the current time and data with strftime from the datetime module
        # used this stackoverflow thread
        # https://stackoverflow.com/questions/3316882/how-do-i-get-a-string-format-of-the-current-date-time-in-python
        self.cur.execute(
            """UPDATE BORROWS SET DateReturned=? WHERE UserId=? and BookId=?""", (time, userId, bookId))
        self.cur.execute(
            """UPDATE BOOKS SET Availability=1 WHERE BookId=?""", (bookId,))
        return "Book Returned"
        self.con.commit()

    def availability_book(self, bookId):
        availability = self.cur.execute(
            """SELECT Availability FROM BOOKS WHERE BookId=?""", (bookId,)).fetchone()["Availability"]
        return availability

    def get_book(self, bookId: int):
        # SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
        # FROM Orders
        # INNER JOIN Customers ON Orders.CustomerID=Customers.CustomerID;
        
        # i am using a full outer join to select all of the data from BOOk_DATA for a given book, as well as the availability and bookid 
        book = self.cur.execute(""" SELECT BOOKS.BookId, BOOKS.Availability, BOOK_DATA.ISBN, 
            BOOK_DATA.Title, BOOK_DATA.GenreId, BOOK_DATA.PublicationDate, BOOK_DATA.Description, 
            BOOK_DATA.CoverImage, AUTHORS.AuthorName, PUBLISHERS.PublisherName, GENRES.GenreName
            FROM BOOKS
            FULL OUTER JOIN BOOK_DATA ON BOOKS.BookDataIsbn = BOOK_DATA.BookDataId
            FULL OUTER JOIN AUTHORS ON BOOK_DATA.AuthorId = AUTHORS.AuthorId
            FULL OUTER JOIN PUBLISHERS ON BOOK_DATA.PublisherId = PUBLISHERS.PublisherId
            FULL OUTER JOIN GENRES ON BOOK_DATA.GenreId = GENRES.GenreId
            WHERE BOOKS.BookId=?""", (bookId,)).fetchall()
        return book

    def get_books(self, conditions: BookConditions, page: int):
        # ran into operational error when writing this, fixed it by changing the syntax of my statement to match the sqlite documentation.

        # i am using a full outer join to select all of the data from BOOk_DATA for a given book, as well as the availability and bookid 
        # i am using book conditions and checking if its the default value to either the rows with any value (checking if it is not equal to a value that is not in the database)...
        # ...or to select a value from the database with the value inputted by a user.
        books = self.cur.execute(f"""SELECT BOOKS.BookId, BOOKS.Availability, BOOK_DATA.ISBN, 
            BOOK_DATA.Title, BOOK_DATA.GenreId, BOOK_DATA.PublicationDate, BOOK_DATA.Description, 
            BOOK_DATA.CoverImage, AUTHORS.AuthorName, PUBLISHERS.PublisherName, GENRES.GenreName
            FROM BOOKS
            FULL OUTER JOIN BOOK_DATA ON BOOKS.BookDataIsbn = BOOK_DATA.BookDataId
            FULL OUTER JOIN AUTHORS ON BOOK_DATA.AuthorId = AUTHORS.AuthorId
            FULL OUTER JOIN PUBLISHERS ON BOOK_DATA.PublisherId = PUBLISHERS.PublisherId
            FULL OUTER JOIN GENRES ON BOOK_DATA.GenreId = GENRES.GenreId
            WHERE {"BOOK_DATA.ISBN=?"if not conditions.isbn == -1 else "BOOK_DATA.ISBN!=?"} AND 
            {"BOOK_DATA.Title LIKE ?" if not conditions.title == '' else "BOOK_DATA.Title!=?"} AND 
            {"BOOKS.Availability=?"if not conditions.availability == -1 else "BOOKS.Availability!=?"} AND 
            {"BOOK_DATA.GenreId=?" if not conditions.genreId == -1 else "BOOK_DATA.GenreId!=?"} AND 
            {"BOOKS.BookId=?" if not conditions.bookId == -1 else "BOOKS.BookId!=?"}
            {f"ORDER BY {conditions.sortBy} {"ASC" if conditions.ascending ==
                                             True else "DESC"}" if not conditions.sortBy == None else ""}
            LIMIT 30 OFFSET {30*(page-1)}""",
            (conditions.isbn, conditions.title, conditions.availability, conditions.genreId, conditions.bookId)).fetchall()
        return books

    def create_genre(self, genreName: str):
        # checks if genre with that name already exists. if it does, then it doesnt create that one and just returns the genreId, otherwise it creates one and then it returns the genreId.
        # this ensures data atomicitiy
        genreId = self.cur.execute(
            """SELECT GenreId FROM GENRES WHERE GenreName=?""", (genreName,)).fetchone()
        if genreId == None:
            genreId = self.cur.execute(
                """INSERT INTO GENRES (GenreName) VALUES (?) REUTRNING GenreId""", (genreName,)).fetchone()
        self.con.commit()
        return genreId['GenreId']

    def edit_genre(self, genreName: str, genreId: int):
        self.cur.execute(
            """UPDATE GENRES SET GenreName=? WHERE GenreId=?""", (genreName, genreId))
        self.con.commit()

    def get_genre(self, genreId):
        genre = self.cur.execute(
            """SELECT * FROM GENRES WHERE GenreId=?""", (genreId,)).fetchone()
        return genre

    def get_genres(self, genreName, page):
        # gets all genres with either a specific name, or all genres whos name is the empty string (no genres in my database can be an empty string as it has the NOT NULL restraint)
        genres = self.cur.execute(f"""SELECT * FROM GENRES
            WHERE {"""GenreName!=?""" if genreName == '' else """GenreName=?"""}
            LIMIT 30 OFFSET {30*(page-1)}""", (genreName + ("" if genreName == "" else "%"),)).fetchall()
        return genres

    def create_author(self, authorName):
        # checks if author with that name already exists. if it does, then it doesnt create that one and just returns the authorId, otherwise it creates one and then it returns the authorId.
        # ensures data atomicity
        authorId = self.cur.execute(
            """SELECT AuthorId FROM AUTHORS WHERE AuthorName=?""", (authorName,)).fetchone()
        if authorId == None:
            authorId = self.cur.execute(
                """INSERT INTO Authors (AuthorName) VALUES (?) RETURNING AuthorId""", (authorName,)).fetchone()
        self.con.commit()
        return authorId['AuthorId']

    def edit_author(self, authorName: str, authorId: int):
        self.cur.execute(
            """UPDATE AUTHORS SET AuthorName=? WHERE AuthorId=?""", (authorName, authorId))
        self.con.commit()

    def get_author(self, authorId: int):
        author = self.cur.execute(
            """SELECT * FROM AUTHORS WHERE AuthorId=?""", (authorId,)).fetchone()
        return author

    def get_authors(self, page: int, authorName=""):
        # gets all authors with either a specific name, or all authors whos name is the empty string (no authors in my database can be an empty string as it has the NOT NULL restraint)
        authors = self.cur.execute(f"""SELECT * FROM AUTHORS
            WHERE {"""AuthorName=?""" if not authorName == '' else """AuthorName!=?"""}
            ORDER BY AuthorName ASC
            LIMIT 30 OFFSET {30*(page-1)}""", (authorName + ("%" if not authorName == "" else ""),)).fetchall()
        return authors

    def create_publisher(self, publisherName):
        # checks if the book has no publisher. if it doesnt, then it returns the genreId of the NONE publisher, otherwise, it creates a publisher with that name.
        if publisherName == '':
            return 0
        else:
            publisherId = self.cur.execute(
                """INSERT INTO PUBLISHERS (PublisherName) VALUES (?) RETURNING PublisherId""", (publisherName,)).fetchone()
            self.con.commit()
            return publisherId['PublisherId']

    def edit_publisher(self, publisherName: str, publisherId: int):
        self.cur.execute(
            """UPDATE PUBLISHERS SET PublisherName=? WHERE PublisherId=?""", (publisherName, publisherId))
        self.con.commit()

    def get_publisher(self, publisherId: int):
        publisher = self.cur.execute(
            """SELECT * FROM PUBLSHERS WHERE PublisherId=?""", (publisherId,)).fetchone()
        return publisher

    def get_publishers(self, page: int, publisherName=""):
        publishers = self.cur.execute(f"""SELECT * FROM PUBLISHERS
            WHERE {"""PublisherName=?""" if not publisherName == '' else """PublisherName!=?"""}
            ORDER BY PublisherName ASC
            LIMIT 30 OFFSET {30*(page-1)}""", (publisherName + ("%" if not publisherName == "" else ""),)).fetchall()
        return publishers

    def create_user(self, user: User):
        # check username and email is unique
        retrievedUsername = self.cur.execute(
            """SELECT userId FROM USERS WHERE Email=?""", (user.email,)).fetchone()
        retrievedEmail = self.cur.execute(
            """SELECT userId FROM USERS WHERE Username=?""", (user.username,)).fetchone()
        if retrievedUsername == None and retrievedEmail == None:
            userId = self.cur.execute("""INSERT OR IGNORE INTO USERS (Username, Schoolyear, FirstName, LastName, Password, Permissions, email) 
                                      VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING UserId""", (user.username, user.schoolYear, user.firstName, user.lastName, user.password, user.permissions, user.email)).fetchone()
            self.con.commit()
            return userId
        else:
            return "EMAIL/USERNAME TAKEN"

    def edit_user(self, user: User, userId: int):
        self.cur.execute("""UPDATE USERS SET Schoolyear=?, FirstName=?, LastName=? WHERE UserId=?""",
                         (user.schoolYear, user.firstName, user.lastName, userId))
        self.con.commit()

    def check_user_password(self, username, inputPassword):
        retrievedPassword = self.cur.execute(
            """SELECT Password FROM USERS WHERE Username=?""", (username,)).fetchone()['Password']
        self.con.commit()
        return retrievedPassword == inputPassword

    def change_password(self, newPassword, userId):
        self.cur.execute(
            """UPDATE USERS SET Password=? WHERE UserId=?""", (newPassword, userId))
        self.con.commit()

    def update_username(self, newUsername, userId):
        # checks if username is unique before editing it
        retrievedUsername = self.cur.execute(
            """SELECT userId FROM USERS WHERE Username=?""", (newUsername,)).fetchone()
        if retrievedUsername == None:
            self.cur.execute(
                """UPDATE USERS SET Username=? WHERE UserId=?""", (newUsername, userId))
            self.con.commit()
            return "DONE"
        else:
            return "USERNAME_TAKEN"

    def check_username_available(self, username: str):
        # checks if the UserId retrieved from the database is null, as a null value means that there is no record in that database with that username.
        retrievedUsername = self.cur.execute(
            """SELECT UserId FROM USERS WHERE Username=?""", (username,)).fetchone()
        if retrievedUsername == None:
            return True
        else:
            return False

    def get_userid(self, username: str):
        return self.cur.execute("""SELECT userId FROM USERS WHERE Username=?""", (username,)).fetchone()

    def get_user(self, userId: int):
        return self.cur.execute("""SELECT * FROM USERS WHERE UserId=?""", (userId,)).fetchone()

    def get_users(self, conditions: UserConditions, page: int):
        # i am using my user conditions class and checking if its the default value to either the rows with any value (checking if it is not equal to a value that is not in the database)...
        # ...or to select a value from the database with the value inputted by a user.
        users = self.cur.execute(f"""SELECT * FROM USERS WHERE
            {"SchoolYear=?"if not int(conditions.schoolYear) == -1 else "SchoolYear!=?"} AND
            {"FirstName=?"if not conditions.firstName == "" else "FirstName!=?"} AND
            {"LastName=?"if not conditions.lastName == "" else "LastName!=?"} AND
            {"Username=?"if not conditions.username == "" else "Username!=?"} AND
            {"UserId=?"if not conditions.userId == -1 else "UserId!=?"}
            LIMIT 30 OFFSET {30*(page-1)}""",
            (int(conditions.schoolYear), conditions.firstName, conditions.lastName, conditions.username, conditions.userId)).fetchall()
        return users

    def create_notification(self, userId: int, notificationContent: str, notificationType: str):
        # bookDataCmd = f"INSERT INTO BOOK_DATA (BookDataId, ISBN, Title, AuthorId, GenreId, PublicationDate, PublisherId, Description, CoverImage) VALUES ({Book.isbn,Book.title,Book.author_id,Book.genre_id,Book.publication_date,Book.publisher_id,Book.description,Book.cover_image}) RETURNING (BookDataId)"
        time = self.datetime.datetime.now().strftime("%I:%M%p on %B %d, %Y")
        # time string code taken from https://stackoverflow.com/questions/3316882/how-do-i-get-a-string-format-of-the-current-date-time-in-python
        notificationId = self.cur.execute("""INSERT INTO NOTIFICATIONS (UserId, NotificationCntent, NotificationDate, MotificationType, NotificationRead) 
            VALUES (?, ?, ?, ?, ?) RETURNING (NotificationId)""", (userId, notificationContent, time, notificationType, 0)).fetchone()
        self.con.commit()
        return notificationId

    def read_notification(self, notificationId):
        self.cur.execute(
            """UPDATE NOTIFICATIONS SET NotificationRead=1 WHERE NotificationId=?""", (notificationId,))
        self.con.commit()

    def get_notifications(self, userId: int):
        return self.cur.execute("""SELECT * FROM NOTIFICATIONS WHERE UserId=?""", (userId,)).fetchall()

    def create_hold_request(self, bookId, userId):
        self.cur.execute(
            """INSERT INTO HOLDS (UserId, BookId, Status) VALUES (?, ?, 1)""", (bookId, userId))
        self.con.commit()

    def edit_hold_request(self, bookId, userId, status):
        self.cur.execute(
            """UPDATE HOLDS SET Status=? WHERE UserId=? AND BookId=?""", (status, userId, bookId))
        self.con.commit

    def get_hold_requests(self):
        # wrote a full outer join ol holds, books, and users, to get the username where the userid is equal to that in the hold request, and the same for books/bookid
        # decided to remove that, and instead have the front end just use the /api/get_book/ and /api/get_user/ route to find the book or user with that specific id.
        return self.cur.execute("""SELECT * FROM HOLDS WHERE Status=1""").fetchall()
