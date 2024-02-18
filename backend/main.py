from flask import Flask, send_from_directory
import os
import variables
from db import DatabaseQueue

app = Flask(__name__, static_folder=variables.STATIC_FOLDER)
database_queue = DatabaseQueue(variables.DATABASE_PATH)

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

@app.route('/api/create_user/')
def create_user():
    return ...

@app.route('/api/edit_user/')
def edit_user():
    return ...

@app.route('/api/change_password/')
def change_password():
    return ...

@app.route('/api/change_username/')
def change_username():
    return ...

@app.route('/api/login')
def login():
    return ...

# catalogue handling 

@app.route('/api/create_book/')
def create_book():
    return ...

@app.route('/api/edit_book/')
def edit_book():
    return ...

# circulation handling

@app.route('/api/creat_hold_request/')
def creat_hold_request():
    return ...

@app.route('/api/toggle_hold_request/')
def toggle_hold_request():
    return ...

# library handling

@app.route('/api/send_notification/')
def send_notification():
    return ...

@app.route('/api/view_notification/')
def view_notification():
    return ...


if __name__ == '__main__':
    # flask app
    app.run(debug=True, port=8080)