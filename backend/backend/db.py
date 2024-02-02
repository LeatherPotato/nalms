# TODO write database connection code
# and make sure all instructions are put into a queue and then executed sequentially
# 2 separate queues for read and write instructions would be ideal

import sqlite3
from backend import app

con = sqlite3.connect('database/lms.db')
cur = con.cursor()

@app.route('/api/db/<type>/')
def main():
    ...

@app.route('/api/db/')
def hi():
    return 'hi, this is the db api page'

if __name__ == '__main__':
    app.run(debug=True, port=8080)
