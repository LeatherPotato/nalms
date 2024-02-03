import queue
import sqlite3

class DatabaseQueue:
    def __init__(self, db_path):
        self.db_queue = queue.Queue()
        self.con = sqlite3.connect(db_path)
        # print(con.total_changes)
        self.cur = self.con.cursor()

    def enqueue(self, cmd):
        # TODO rewrite so that the SQL commands can be written here, with different editing modes
        self.db_queue.put(cmd)
        self.run_queue()

    def run_queue(self):
        if not self.db_queue.qsize == 0:
            self.cur.execute(self.db_queue.get())
            self.run_queue()
        else:
            self.con.commit()
    
    def db_read(self, select_field, from_field, where_field):
        self.cur.execute(f'SELECT {select_field} FROM {from_field} WHERE {where_field}')
        rows = self.cur.fetchall()
        return rows