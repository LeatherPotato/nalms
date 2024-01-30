from flask import Flask, send_from_directory
import os
import sqlite3

app = Flask(__name__, static_folder='client/build', static_url_path='/')

con = sqlite3.connect('database/lms.db')
cur = con.cursor()

# serve react app


@app.route('/', defaults={'path': ''})
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

@app.route('/api/')
def api_home():
    return 'welcome to the NALMS api'


if __name__ == '__main__':
    app.run(debug=True, port=8080)
