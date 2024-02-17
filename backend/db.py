class Database:
    import sqlite3
    from custom_classes import Book as BookClass
    from custom_classes import User as UserClass
    import datetime

    def __init__(self, db_path):
        self.con = self.sqlite3.connect(db_path)
        # print(con.total_changes)
        self.cur = self.con.cursor()

    def read_data(self, select_fields: list, from_field: str, where_fields: list):
        # DONE: upgrade to add multiple select fields and multiple where fields.
        self.cur.execute(f"SELECT {",".join(select_fields)} FROM {from_field} WHERE {",".join(where_fields)}")
        rows = self.cur.fetchall()
        return rows

    def delete_row(self, table: str, conditions: list):
        self.cur.execute(f"DELETE FROM ? WHERE {",".join(conditions)}", (table,))

    def create_book(self, Book: BookClass):
        bookDataPk = self.cur.execute("SELECT BookDataId FROM BOOK_DATA WHERE ISBN=?", (Book.isbn,)).fetchone()
        if bookDataPk == None:
            Book.author_id = self.create_author(Book.author_name)
            Book.genre_id = self.create_genre(Book.genre_name)
            Book.publisher_id = self.create_publisher(Book.publisher_name)
            bookDataPk = self.cur.execute("INSERT INTO BOOK_DATA (ISBN, Title, AuthorId, GenreId, PublicationDate, PublisherId, Description, CoverImage) VALUES(?,?,?,?,?,?,?,?) RETURNING (BookDataId)", (Book.isbn, Book.title, Book.author_id, Book.genre_id, Book.publication_date, Book.publisher_id, Book.description, Book.cover_image)).fetchone()[0]
        bookId = self.cur.execute("INSERT INTO BOOKS (Availability, BookDataIsbn) VALUES (0, ?) RETURNING (BookId)", (bookDataPk[0],)).fetchone()
        self.con.commit()
        return bookId

    def borrow_book(self, userId, bookId):
        time = self.datetime.datetime.now().strftime("%I:%M%p on %B %d, %Y")
        self.cur.execute("INSERT OR REPLACE INTO BORROWS (UserId, BookId, DateBorrowed) VALUES (?, ?, ?)", (userId, bookId, time))
        self.cur.execute("UPDATE BOOKS SET Availability=1 WHERE BookId=?", (bookId))
        self.con.commit()
    
    def return_book(self, userId, bookId):
        time = self.datetime.datetime.now().strftime("%I:%M%p on %B %d, %Y")
        self.cur.execute("UPDATE BORROWS SET DateReturned=? WHERE UserId=?, BookId=?", (time, userId, bookId))
        self.cur.execute("UPDATE BOOKS SET Availability=0 WHERE BookId=?", (bookId))
        self.con.commit()

    def availability_book(self):
        availability = self.cur.execute("SELECT FROM WHERE")

    def create_genre(self, genreName: str):
        genreId = self.cur.execute("SELECT GenreId FROM GENRES WHERE GenreName=?", (genreName,)).fetchone()
        if genreId == None:
            genreId = self.cur.execute("INSERT INTO GENRES (GenreName) VALUES (?)", (genreName,)).fetchone()
        self.con.commit()
        return genreId[0]

    def edit_genre(self, genreName: str, genreId : int):
        self.cur.execute("UPDATE GENRES SET GenreName=? WHERE GenreId=?", (genreName, genreId))

    def create_author(self, authorName):
        authorId = self.cur.execute("SELECT AuthorId FROM AUTHORS WHERE AuthorName=?", (authorName,)).fetchone()
        if authorId == None:
            authorId = self.cur.execute("INSERT INTO Authors (AuthorName) VALUES (?)", (authorName,)).fetchone()
        self.con.commit()
        return authorId[0]

    def create_publisher(self, publisherName):
        if publisherName == '':
            return 0
        else:
            publisherId = self.cur.execute("INSERT INTO PUBLISHERS (PublisherName) VALUES (?)", (publisherName,)).fetchone()[0]
            self.con.commit()
            return publisherId

    def create_user(self, User: UserClass, creatorUserId : int):
        creatorPerms = self.cur.execute("SELECT Permissions FROM USERS WHERE UserId=?", (creatorUserId,)).fetchone()
        if creatorPerms == None:
            return "ERR"
        else:
            if creatorPerms[0][0] == '1':
                userId = self.cur.execute("INSERT INTO USERS (Username, Schoolyear, FirstName, LastName, Password, Permissions) VALUES (?, ?, ?, ?, ?, ?) RETURNING UserId", (User.username, User.schoolYear, User.firstName, User.lastName, User.password, User.permissions)).fetchone()[0]
                self.con.commit()
                return userId
            
    def edit_user(self, User: UserClass, userId, editorId : int):
        if editorId == userId:
            # users can edit themselves, except for the permissions and username fields
            self.cur.execute("UPDATE USERS SET Schoolyear=?, FirstName=?, LastName=?, Password=? WHERE UserId=?", (User.schoolYear, User.firstName, User.lastName, User.password, userId))
            self.con.commit()
        else:
            creatorPerms = self.cur.execute("SELECT Permissions FROM USERS WHERE UserId=?", (editorId,)).fetchone()
            if creatorPerms == None:
                return "ERR"
            else:
                if creatorPerms[0][0] == '1':
                    # the difference here is that this one allows admins to edit user permissions, but they still cannot change usernames and passwords
                    self.cur.execute("UPDATE USERS SET Schoolyear=?, FirstName=?, LastName=?, Permissions=? WHERE UserId=?", (User.schoolYear, User.firstName, User.lastName, User.password, userId))
                    self.con.commit()

    def check_user_password(self, username, inputPassword):
        retrievedPassword = self.cur.execute("SELECT Password FROM USERS WHERE Username=?", (username,)).fetchone()[0]
        self.con.commit()
        return retrievedPassword == inputPassword

    def change_password(self, newPassword, userId):
        self.cur.execute("UPDATE USERS SET Password=? WHERE UserId=?", (newPassword, userId))
        self.con.commit()
    
    def update_username(self, newUsername, userId):
        retrievedUsername = self.cur.execute("SELECT userId FROM USERS WHERE Username=", (newUsername,)).fetchone()
        if retrievedUsername == None:
            self.cur.execute("UPDATE USERS SET Username=? WHERE UserId=?", (newUsername, userId))
            self.con.commit()
        else:
            return "USERNAME_TAKEN"
            

    def create_notification(self, userId: int, notificationContent: str, notificationType: str):
        # bookDataCmd = f"INSERT INTO BOOK_DATA (BookDataId, ISBN, Title, AuthorId, GenreId, PublicationDate, PublisherId, Description, CoverImage) VALUES ({Book.isbn,Book.title,Book.author_id,Book.genre_id,Book.publication_date,Book.publisher_id,Book.description,Book.cover_image}) RETURNING (BookDataId)"
        time = self.datetime.datetime.now().strftime("%I:%M%p on %B %d, %Y")
        # time string code taken from https://stackoverflow.com/questions/3316882/how-do-i-get-a-string-format-of-the-current-date-time-in-python
        notificationId = self.cur.execute("INSERT INTO NOTIFICATIONS (UserId, NotificationCntent, NotificationDate, MotificationType, NotificationRead) VALUES (?, ?, ?, ?, ?) RETURNING (NotificationId)", (userId, notificationContent, time, notificationType, 0)).fetchone()[0]
        self.con.commit()
        return notificationId

    def read_notification(self, notificationId):
        self.cur.execute("UPDATE NOTIFICATIONS SET NotificationRead=1 WHERE NotificationId=?", (notificationId,))
        self.con.commit()

    def create_hold_request(self, bookId, userId):
        self.cur.execute("INSERT INTO HOLDS (UserId, BookId, Status) VALUES (?, ?, 1)", (bookId, userId))
        self.con.commit()

    def edit_hold_request(self, bookId, userId, status):
        self.cur.execute("UPDATE HOLDS SET Status=? WHERE UserId=?, BookId=?", (status, userId, bookId))
        self.con.commit
