from flask import Flask, send_from_directory
import os
import variables
from db import DatabaseQueue

app = Flask(__name__, static_folder='client/build', static_url_path='build/')
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

@app.route('/api/')
def r_name():
    pass

@app.route('/api/')
def r_name():
    pass



if __name__ == '__main__':
    # flask app
    app.run(debug=True, port=8080)