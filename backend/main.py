from flask import Flask, send_from_directory, request
import os

import variables
import validation
from db import Database
import custom_classes
import conversions

app = Flask(__name__, static_folder=variables.STATIC_FOLDER)
db = Database(variables.DATABASE_PATH)

# serve react app

@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        # returns error page 
        # FIXME edit later to return actual error page
        return send_from_directory(app.static_folder, 'index.html')

# API/server code
# remnember to put all utoils 

@app.route('/')
def hello():
    return 'ellow, mate'

# API route options/data must be formatted as opt1;opt2;opt3
# TODO comment

@app.route('/api/')
def api_home():
    return 'welcome to the NALMS api'

# user handling

@app.route('/api/create_user/', methods=['GET', 'POST'])
def create_user():
    if request.is_json:
        data = request.data
        if db.check_user_permissions(userId=data.get('senderUserId'), action=8):
            if validation.validate_email(data.get('email')) and validation.validate_password(data.get('password')) and validation.validate_username(data.get('username')):
                if db.check_username_available(data.get('username')):
                    hashedPassword = conversions.hash_password(input_password=data.get('password'))
                    user = custom_classes.User(input_fname=data.get('fisrtName'),
                                input_lname=data.get('lastName'),
                                input_password=hashedPassword,
                                input_schoolYear=data.get('schoolYear'),
                                input_username=data.get('username'),
                                perms=data.get('userPerms'),
                                email=data.get('email')
                                )
                    userId = db.create_user(user)
                    return userId
                else:
                    return "ERR Username Taken"
            else:
                return "ERR Invalid Data"
        else:
            return "ERR Missing Permissions"
    else:
        return "ERR Content type is not supported."

@app.route('/api/change_password/', methods=['GET', 'POST'])
def change_password():
    if request.is_json:
        data = request.json
        if validation.validate_password(data.get('password')):
            password = conversions.hash_password(data.get('password'))
            db.change_password(newPassword=password, userId=data.get('senderUserId'))
            return "SUCCESS Password Changed"
        else:
            return "ERR Invalid Password"
    else:
        return "Content type is not supported."
    
@app.route('/api/change_username/', methods=['GET', 'POST'])
def change_username():
    if request.is_json:
        data = request.data
        if db.check_user_permissions(userId=data.get('senderUserId'), action=8) or data.get('senderUserID') == data.get('userId'):
            if db.check_username_available(data.get('username')):
                db.update_username(newUsername=data.get('username'), userId=data.get('senderUserId'))
                return "SUCCESS Username Changed"
            else:
                return "ERR Username Taken"
        else:
            return "ERR Missing Permissions"
    else:
        return "ERR Content type is not supported."
    
@app.route('/api/login', methods=["GET", "POST"])
def login():
    if request.is_json:
        data = request.data
        password = conversions.hash_password(data.get('password'))
        if db.check_user_password(username=data.get('username')):
            return db.get_userid(username=data.get('username'))
        else:
            return "ERR Incorrect Password"
    else:
        return "ERR Content type is not supported."

@app.route('/api/get_user/')
def get_user():
    if request.is_json:
        data = request.data
        return db.get_user(userId=data.get('userId'))
    else:
        return "ERR Content type is not supported."

@app.route('/api/get_users/')
def get_users():
    if request.is_json:
        data = request.data
        conditions = custom_classes.UserConditions(
            schoolYear=data.get('schoolYear'),
            firstName=data.get('firstName'),
            lastName=data.get('lastName'),
            username=data.get('username'),
            sortBy=data.get('sortBy'),
            ascending=data.get('ascending'))
        return db.get_users(conditions=conditions, page=data.get('page'))
    else:
        return "ERR Content type is not supported."

@app.route('/api/send_notification/')
def send_notification():
    if request.is_json:
        data = request.data
        db.create_notification(userId=data.get('userId'), notificationContent=data.get('notificationContent'), notificationType=data.get('notificationType'))
    else:
        return "ERR Content type is not supported."

@app.route('/api/get_notifications')
def get_notification():
    if request.is_json:
        data = request.data
        return db.get_notifications(userId=data.get('userId'))
    else:
        return "ERR Content type is not supported."

@app.route('/api/read_notification/')
def read_notification():
    if request.is_json:
        data = request.data
        db.read_notification(data.get('notificationId'))
        return "SUCCESS Notification Read"
    else:
        return "ERR Content type is not supported."

# catalogue handling 

@app.route('/api/create_book/', methods=['GET', 'POST'])
def create_book():
    if request.is_json:
        data = request.json
        if not conversions.convert_isbn(data.get('isbn')) == None:
            if db.check_user_permissions(userId=data.get('senderUserId'), action=4):
                book = custom_classes.Book(isbn13=data.get('isbn'), genre_name=data.get('genre'))
                bookId = db.create_book(book)
                return bookId
            else:
                return "ERR Missing Permissions"
        else:
            return "ERR Invalid ISBN"
    else:
        return "ERR Content type is not supported."

@app.route('/api/delete_book/', methods=['GET', 'POST'])
def delete_book():
    if request.is_json:
        data = request.json
        if db.check_user_permissions(userId=data.get('senderUserId'), action=4):
            db.delete_row(table="BOOKS", conditions=[f"BookId={data.get('bookId')}"])
            return "SUCCESS Book Deleted"
        else:
            return "ERR Missing Permissions"
    else:
        return "ERR Content type is not supported."

@app.route('/api/get_book/')
def get_book():
    if request.is_json:
        data = request.data
        return db.get_book(bookId=data.get('bookId'))
    else:
        return "ERR Content type is not supported."

@app.route('/api/get_books/')
def get_books():
    if request.is_json:
        data = request.data
        conditions = custom_classes.BookConditions(
            isbn=data.get('isbn'),
            title=data.get('title'),
            availability=data.get('availability'),
            genreId=data.get('genreId'),
            sortBy=data.get('sortBy'),
            ascending=data.get('ascending'))
        return db.get_books(conditions=conditions, page=data.get('page'))
    else:
        return "ERR Content type is not supported."

# circulation handling

@app.route('api/borrow_book/', methods=['GET', 'POST'])
def borrow_book():
    if request.is_json:
        data = request.data
        if db.check_user_permissions(userId=data.get('senderUserId'), action=2):
            bookId = data.get('bookId')
            userId = data.get('borrowerId')
            if db.availability_book(bookId=bookId):
                db.edit_hold_request(bookId=bookId, userId=userId, status=0)
                db.borrow_book(userId=userId, bookId=bookId)
            else:
                return "ERR Book Unavailable"
        else:
            return "ERR Missing Permissions"
    else:
        return "ERR Content type is not supported."

@app.route('api/return_book/', methods=['GET', 'POST'])
def return_book():
    if request.is_json:
        data = request.data
        if db.check_user_permissions(userId=data.get('senderUserId'), action=2):
            bookId = data.get('bookId')
            userId = data.get('borrowerId')
            if not db.availability_book(bookId=bookId):
                db.return_book(userId=userId, bookId=bookId)
            else:
                return "ERR Book Not Borrowed"
        else:
            return "ERR Missing Permissions"
    else:
        return "ERR Content type is not supported."

@app.route('/api/creat_hold_request/', methods=["GET", "POSTo"])
def creat_hold_request():
    if request.is_json:
        data = request.data
        if db.check_user_permissions(userId=data.get('senderUserId'), action=1):
            db.create_hold_request(bookId=data.get('bookId'), userId=data.get('senderUserId'))
            return "SUCCESS Created Hold Request!"
        else:
            return "ERR Missing Permissions"
    else:
        return "ERR Content type is not supported."

@app.route('/api/remove_hold_request/', methods=["GET", "POST"])
def remove_hold_request():
    if request.is_json:
        data = request.data
        if db.check_user_permissions(userId=data.get('senderUserId'), action=1):
            db.edit_hold_request(bookId=data.get('bookId'), userId=data.get('senderUserId'), status=0)
            return "SUCCESS Hold Request Removed"
        else:
            return "ERR Missing Permissions"
    else:
        return "ERR Content type is not supported."

@app.route('/api/get_hold_requests/')
def get_hold_requests():
    return db.get_hold_requests()

# library handling

@app.route('/api/create_publisher')
def create_publisher():
    if request.is_json:
        data = request.data
        if db.check_user_permissions(userId=data.get('senderUserId'), action=4):
            db.create_publisher(publisherName=data.get('publisherName'))
            return "SUCCESS Created Publisher"
        else:
            return "ERR Missing Permissions"
    else:
        return "ERR Content type is not supported."

@app.route('/api/edit_publisher')
def create_publisher():
    if request.is_json:
        data = request.data
        if db.check_user_permissions(userId=data.get('senderUserId'), action=4):
            db.edit_publisher(publisherName=data.get('publisherName'), publisherId=data.get('publisherId'))
            return "SUCCESS Edited publisher"
        else:
            return "ERR Missing Permissions"
    else:
        return "ERR Content type is not supported."

@app.route('/api/get_publisher')
def get_publisher():
    if request.is_json:
        data = request.data
        return db.get_publisher(publisherId=data.get('publisherId'))
    else:
        return "ERR Content type is not supported."

@app.route('/api/get_publishers')
def get_publishers():
    if request.is_json:
        data = request.data
        return db.get_publishers(publisherName=data.get('publisherName'), page=data.get('page'))
    else:
        return "ERR Content type is not supported."

@app.route('/api/create_author')
def create_author():
    if request.is_json:
        data = request.data
        if db.check_user_permissions(userId=data.get('senderUserId'), action=4):
            db.create_author(authorName=data.get('authorName'))
            return "SUCCESS Created author"
        else:
            return "ERR Missing Permissions"
    else:
        return "ERR Content type is not supported."

@app.route('/api/edit_author')
def create_author():
    if request.is_json:
        data = request.data
        if db.check_user_permissions(userId=data.get('senderUserId'), action=4):
            db.edit_author(authorName=data.get('authorName'), authorId=data.get('authorId'))
            return "SUCCESS Edited author"
        else:
            return "ERR Missing Permissions"
    else:
        return "ERR Content type is not supported."

@app.route('/api/get_author')
def get_author():
    if request.is_json:
        data = request.data
        return db.get_author(authorId=data.get('authorId'))
    else:
        return "ERR Content type is not supported."

@app.route('/api/get_authors')
def get_authors():
    if request.is_json:
        data = request.data
        return db.get_authors(authorName=data.get('authorName'), page=data.get('page'))
    else:
        return "ERR Content type is not supported."

@app.route('/api/create_genre')
def create_genre():
    if request.is_json:
        data = request.data
        if db.check_user_permissions(userId=data.get('senderUserId'), action=4):
            db.create_genre(genreName=data.get('genreName'))
            return "SUCCESS Created genre"
        else:
            return "ERR Missing Permissions"
    else:
        return "ERR Content type is not supported."

@app.route('/api/edit_genre')
def create_genre():
    if request.is_json:
        data = request.data
        if db.check_user_permissions(userId=data.get('senderUserId'), action=4):
            db.edit_genre(genreName=data.get('genreName'), genreId=data.get('genreId'))
            return "SUCCESS Editedgenrer"
        else:
            return "ERR Missing Permissions"
    else:
        return "ERR Content type is not supported."

@app.route('/api/get_genre')
def get_genre():
    if request.is_json:
        data = request.data
        return db.get_genre(genreId=data.get('genreId'))
    else:
        return "ERR Content type is not supported."

@app.route('/api/get_genres')
def get_genres():
    if request.is_json:
        data = request.data
        return db.get_genres(genreName=data.get('genreName'), page=data.get('page'))
    else:
        return "ERR Content type is not supported."



if __name__ == '__main__':
    # flask app
    app.run(debug=True, port=8080)