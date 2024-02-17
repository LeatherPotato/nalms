class DatabaseQueue:
    import sqlite3
    import queue
    from custom_classes import Book as BookClass
    from custom_classes import User as UserClass
    import datetime

    def __init__(self, db_path):
        self.db_queue = self.queue.Queue()
        self.con = self.sqlite3.connect(db_path)
        # print(con.total_changes)
        self.cur = self.con.cursor()

    def read_data(self, select_fields: list, from_field: str, where_fields: list):
        # DONE: upgrade to add multiple select fields and multiple where fields.
        self.cur.execute(f"SELECT {",".join(select_fields)} FROM {from_field} WHERE {",".join(where_fields)}")
        rows = self.cur.fetchall()
        return rows

    def delete_row(self, table: str, conditions: list):
        self.cur.execute(f"DELETE FROM ? WHERE {",".join(conditions)}", (table))

    def create_book(self, Book: BookClass):
        Book.author_id = self.create_author(Book.author_name)
        Book.genre_id = self.create_genre(Book.genre_name)
        Book.publisher_id = self.create_publisher(Book.publisher_name)
        bookDataPk = self.cur.execute("INSERT OR IGNORE INTO BOOK_DATA (BookDataId, ISBN, Title, AuthorId, GenreId, PublicationDate, PublisherId, Description, CoverImage) VALUES(?,?,?,?,?,?,?,?,?)", (Book.isbn, Book.title, Book.author_id, Book.genre_id, Book.publication_date, Book.publisher_id, Book.description, Book.cover_image)).fetchone()[0]
        bookId = self.cur.execute("INSERT OR IGNORE INTO BOOKS(Availability, BookDataIsbn) VALUES(0, ?) RETURNING (BookId)", (bookDataPk)).fetchone()[0]
        return bookId

    def edit_book(self):
        ...

    def checkout_book(self):
        ...

    def availability_book(self):
        ...

    def create_genre(self, genreName: str):
        genreId = self.cur.execute("SELECT GenreId FROM GENRES WHERE GenreName=?", (genreName)).fetchone()
        if len(genreId) == 0:
            genreId = self.cur.execute("INSERT OR IGNORE INTO GENRES (GenreName) VALUES (?)", (genreName)).fetchone()
        return genreId[0]

    def edit_genre(self, genreName: str):
        ...

    def create_author(self, authorName):
        authorId = self.cur.execute("SELECT FROM AUTHORS HWHERE AuthorName=?", (authorName)).fetchone()
        if len(authorId) == 0:
            authorId = self.cur.execute("INSERT OR IGNORE INTO Authors (AuthorName) VALUES (?)", (authorName)).fetchone()
        return authorId[0]

    def edit_author(self):
        ...

    def create_publisher(self, publisherName):
        publisherId = self.cur.execute("INSERT OR IGNORE INTO PUBLISHERS (PublisherName) VALUES (?)", (publisherName)).fetchone()[0]
        return publisherId

    def edit_publisher(self):
        ...

    def create_user(self, User: UserClass):
        ...

    def edit_user(self):
        ...

    def check_user_password(self, username, inputPassword):
        retrievedPassword = self.cur.execute("SELECT Password FROM USERS WHERE Username='?'", (username)).fetchone()[0]
        return retrievedPassword == inputPassword

    def create_notification(self, userId: int, notificationContent: str, notificationType: str):
        # bookDataCmd = f"INSERT OR IGNORE INTO BOOK_DATA (BookDataId, ISBN, Title, AuthorId, GenreId, PublicationDate, PublisherId, Description, CoverImage) VALUES ({Book.isbn,Book.title,Book.author_id,Book.genre_id,Book.publication_date,Book.publisher_id,Book.description,Book.cover_image}) RETURNING (BookDataId)"
        time = self.datetime.datetime.now().strftime("%I:%M%p on %B %d, %Y")
        notificationId = self.cur.execute("INSERT INTO NOTIFICATIONS (UserId, NotificationCntent, NotificationDate, MotificationType, NotificationRead) VALUES (?, ?, ?, ?, ?) RETURNING (NotificationId)", (userId, notificationContent, time, notificationType, 0)).fetchone()[0]
        return notificationId

    def edit_notification(self):
        ...

    def create_librarian(self):
        ...

    def edit_librarian(self):
        ...

    def create_hold_request(self):
        ...

    def edit_hold_request(self):
        ...
