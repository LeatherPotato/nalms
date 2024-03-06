from flask import Flask, send_from_directory, request, jsonify
import json
from flask_cors import CORS
import os

import variables
import validation
from db import Database
import custom_classes
import conversions

app = Flask(__name__, static_folder=variables.STATIC_FOLDER)
CORS(app, origins=["https://localhost:8080", "http://localhost:8080", "https://localhost:3000", "http://localhost:3000", "192.168.0.37"])
db = Database(variables.DATABASE_PATH)

# serve react app

@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        # returns error page 
        # FIXME edit later to return json.dumps(actual error page
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
        data = request.json
        if db.check_user_permissions(userId=data['senderUserId'], action=8):
            if validation.validate_email(data['email']) and validation.validate_password(data['password']) and validation.validate_username(data['username']):
                if db.check_username_available(data['username']):
                    hashedPassword = conversions.hash_password(input_password=data['password'])
                    user = custom_classes.User(input_fname=data['fisrtName'],
                                input_lname=data['lastName'],
                                input_password=hashedPassword,
                                input_schoolYear=data['schoolYear'],
                                input_username=data['username'],
                                perms=data['userPerms'],
                                email=data['email']
                                )
                    userId = db.create_user(user)
                    return json.dumps(userId)
                else:
                    return json.dumps("ERR Username Taken")
            else:
                return json.dumps("ERR Invalid Data")
        else:
            return json.dumps("ERR Missing Permissions")
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/change_password/', methods=['GET', 'POST'])
def change_password():
    if request.is_json:
        data = request.json
        if validation.validate_password(data['password']):
            password = conversions.hash_password(data['password'])
            db.change_password(newPassword=password, userId=data['senderUserId'])
            return json.dumps("SUCCESS Password Changed")
        else:
            return json.dumps("ERR Invalid Password")
    else:
        return json.dumps("Content type is not supported.")
    
@app.route('/api/change_username/', methods=['GET', 'POST'])
def change_username():
    if request.is_json:
        data = request.json
        if db.check_user_permissions(userId=data['senderUserId'], action=8) or data['senderUserID'] == data['userId']:
            if db.check_username_available(data['username']):
                db.update_username(newUsername=data['username'], userId=data['senderUserId'])
                return json.dumps("SUCCESS Username Changed")
            else:
                return json.dumps("ERR Username Taken")
        else:
            return json.dumps("ERR Missing Permissions")
    else:
        return json.dumps("ERR Content type is not supported.")
    
@app.route('/api/login/', methods=["GET", "POST"])
def login():
    if request.is_json:
        data = request.json
        # print(data)
        password = conversions.hash_password(data['password'])
        # print(password)
        if db.check_user_password(username=data['username'], inputPassword=password):
            return json.dumps(db.get_userid(username=data['username']))
        else:
            return json.dumps("ERR Incorrect Password")
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/get_user/', methods=["GET", "POST"])
def get_user():
    if request.is_json:
        data = request.json
        # print(data)
        userId=data.get('userId')
        # print(userId)
        userData = db.get_user(userId=int(userId))
        # print(userData)
        return userData
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/get_users/', methods=["GET", "POST"])
def get_users():
    if request.is_json:
        data = request.json
        conditions = custom_classes.UserConditions(
            schoolYear=data['schoolYear'],
            firstName=data['firstName'],
            lastName=data['lastName'],
            username=data['username'],
            sortBy=data['sortBy'],
            ascending=data['ascending'])
        return json.dumps(db.get_users(conditions=conditions, page=data['page']))
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/send_notification/', methods=["GET", "POST"])
def send_notification():
    if request.is_json:
        data = request.json
        db.create_notification(userId=data['userId'], notificationContent=data['notificationContent'], notificationType=data['notificationType'])
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/get_notifications/', methods=["GET", "POST"])
def get_notification():
    if request.is_json:
        data = request.json
        return json.dumps(db.get_notifications(userId=data['userId']))
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/read_notification/', methods=["GET", "POST"])
def read_notification():
    if request.is_json:
        data = request.json
        db.read_notification(data['notificationId'])
        return json.dumps("SUCCESS Notification Read")
    else:
        return json.dumps("ERR Content type is not supported.")

# catalogue handling 

@app.route('/api/create_book/', methods=['GET', 'POST'])
def create_book():
    if request.is_json:
        data = request.json
        if not conversions.convert_isbn(data['isbn']) == None:
            if db.check_user_permissions(userId=data['senderUserId'], action=4):
                book = custom_classes.Book(isbn13=data['isbn'], genre_name=data['genre'])
                bookId = db.create_book(book)
                return json.dumps(bookId)
            else:
                return json.dumps("ERR Missing Permissions")
        else:
            return json.dumps("ERR Invalid ISBN")
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/delete_book/', methods=['GET', 'POST'])
def delete_book():
    if request.is_json:
        data = request.json
        if db.check_user_permissions(userId=data['senderUserId'], action=4):
            db.delete_row(table="BOOKS", conditions=[f"BookId={data['bookId']}"])
            return json.dumps("SUCCESS Book Deleted")
        else:
            return json.dumps("ERR Missing Permissions")
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/get_book/', methods=["GET", "POST"])
def get_book():
    if request.is_json:
        data = request.json
        return json.dumps(db.get_book(bookId=data['bookId']))
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/get_books/', methods=["GET", "POST"])
def get_books():
    if request.is_json:
        data = request.json
        conditions = custom_classes.BookConditions(
            isbn=int(data['isbn']),
            title=data['title'],
            availability=int(data['availability']),
            genreId=int(data['genreId']),
            sortBy=data['sortBy'],
            ascending=data['ascending'])
        # print(conditions.__dict__)
        return json.dumps(db.get_books(conditions=conditions, page=int(data['page'])))
    else:
        return json.dumps("ERR Content type is not supported.")

# circulation handling

@app.route('/api/borrow_book/', methods=['GET', 'POST'])
def borrow_book():
    if request.is_json:
        data = request.json
        if db.check_user_permissions(userId=data['senderUserId'], action=2):
            bookId = data['bookId']
            userId = data['borrowerId']
            if db.availability_book(bookId=bookId):
                db.edit_hold_request(bookId=bookId, userId=userId, status=0)
                db.borrow_book(userId=userId, bookId=bookId)
            else:
                return json.dumps("ERR Book Unavailable")
        else:
            return json.dumps("ERR Missing Permissions")
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/return_book/', methods=['GET', 'POST'])
def return_book():
    if request.is_json:
        data = request.json
        if db.check_user_permissions(userId=data['senderUserId'], action=2):
            bookId = data['bookId']
            userId = data['borrowerId']
            if not db.availability_book(bookId=bookId):
                db.return_book(userId=userId, bookId=bookId)
            else:
                return json.dumps("ERR Book Not Borrowed")
        else:
            return json.dumps("ERR Missing Permissions")
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/creat_hold_request/', methods=["GET", "POSTo"])
def creat_hold_request():
    if request.is_json:
        data = request.json
        if db.check_user_permissions(userId=data['senderUserId'], action=1):
            db.create_hold_request(bookId=data['bookId'], userId=data['senderUserId'])
            return json.dumps("SUCCESS Created Hold Request!")
        else:
            return json.dumps("ERR Missing Permissions")
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/remove_hold_request/', methods=["GET", "POST"])
def remove_hold_request():
    if request.is_json:
        data = request.json
        if db.check_user_permissions(userId=data['senderUserId'], action=1):
            db.edit_hold_request(bookId=data['bookId'], userId=data['senderUserId'], status=0)
            return json.dumps("SUCCESS Hold Request Removed")
        else:
            return json.dumps("ERR Missing Permissions")
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/get_hold_requests/', methods=["GET", "POST"])
def get_hold_requests():
    return json.dumps(db.get_hold_requests())

# library handling

@app.route('/api/create_publisher/', methods=["GET", "POST"])
def create_publisher():
    if request.is_json:
        data = request.json
        if db.check_user_permissions(userId=data['senderUserId'], action=4):
            db.create_publisher(publisherName=data['publisherName'])
            return json.dumps("SUCCESS Created Publisher")
        else:
            return json.dumps("ERR Missing Permissions")
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/edit_publisher/', methods=["GET", "POST"])
def edit_publisher():
    if request.is_json:
        data = request.json
        if db.check_user_permissions(userId=data['senderUserId'], action=4):
            db.edit_publisher(publisherName=data['publisherName'], publisherId=data['publisherId'])
            return json.dumps("SUCCESS Edited publisher")
        else:
            return json.dumps("ERR Missing Permissions")
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/get_publisher/', methods=["GET", "POST"])
def get_publisher():
    if request.is_json:
        data = request.json
        return json.dumps(db.get_publisher(publisherId=data['publisherId']))
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/get_publishers/', methods=["GET", "POST"])
def get_publishers():
    if request.is_json:
        data = request.json
        return json.dumps(db.get_publishers(publisherName=data['publisherName'], page=data['page']))
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/create_author/', methods=["GET", "POST"])
def create_author():
    if request.is_json:
        data = request.json
        if db.check_user_permissions(userId=data['senderUserId'], action=4):
            db.create_author(authorName=data['authorName'])
            return json.dumps("SUCCESS Created author")
        else:
            return json.dumps("ERR Missing Permissions")
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/edit_author/', methods=["GET", "POST"])
def edit_author():
    if request.is_json:
        data = request.json
        if db.check_user_permissions(userId=data['senderUserId'], action=4):
            db.edit_author(authorName=data['authorName'], authorId=data['authorId'])
            return json.dumps("SUCCESS Edited author")
        else:
            return json.dumps("ERR Missing Permissions")
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/get_author/', methods=["GET", "POST"])
def get_author():
    if request.is_json:
        data = request.json
        return json.dumps(db.get_author(authorId=data['authorId']))
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/get_authors/', methods=["GET", "POST"])
def get_authors():
    if request.is_json:
        data = request.json
        return json.dumps(db.get_authors(authorName=data['authorName'], page=data['page']))
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/create_genre/', methods=["GET", "POST"])
def create_genre():
    if request.is_json:
        data = request.json
        if db.check_user_permissions(userId=data['senderUserId'], action=4):
            db.create_genre(genreName=data['genreName'])
            return json.dumps("SUCCESS Created genre")
        else:
            return json.dumps("ERR Missing Permissions")
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/edit_genre/', methods=["GET", "POST"])
def edit_genre():
    if request.is_json:
        data = request.json
        if db.check_user_permissions(userId=data['senderUserId'], action=4):
            db.edit_genre(genreName=data['genreName'], genreId=data['genreId'])
            return json.dumps("SUCCESS Editedgenrer")
        else:
            return json.dumps("ERR Missing Permissions")
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/get_genre/', methods=["GET", "POST"])
def get_genre():
    if request.is_json:
        data = request.json
        return json.dumps(db.get_genre(genreId=data['genreId']))
    else:
        return json.dumps("ERR Content type is not supported.")

@app.route('/api/get_genres/', methods=["GET", "POST"])
def get_genres():
    if request.is_json:
        data = request.json
        # print(data)
        genres = db.get_genres(genreName=data['genreName'], page=int(data['page']))
        # print(genres)
        return genres
    else:
        return json.dumps("ERR Content type is not supported.")



if __name__ == '__main__':
    # flask app
    app.run(debug=True, port=8080)