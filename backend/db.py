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
    
    def read_data(self, select_field, from_field, where_field):
        # TODO upgrade to add multiple select fields and multiple where fields. input parameters will be 
        self.cur.execute(f'SELECT {select_field} FROM {from_field} WHERE {where_field}')
        rows = self.cur.fetchall()
        return rows

    def create_book(self):
        ...

    def edit_book(self):
        ...

    def delete_book(self):
        ...

    def create_author(self):
        ...
    
    def edit_author(self):
        ...
    
    def delete_author(self):
        ...

    def create_publisher(self):
        ...
    
    def edit_publisher(self):
        ...
    
    def delete_publisher(self):
        ...

    def create_user(self):
        ...
    
    def edit_user(self):
        ...
    
    def delete_user(self):
        ...

    def create_notification(self):
        ...
    
    def edit_notification(self):
        ...
    
    def delete_notification(self):
        ...
    
    def create_librarian(self):
        ...
    
    def edit_librarian(self):
        ...
    
    def delete_librarian(self):
        ...
    
    def create_hold_request(self):
        ...
    
    def edit_hold_request(self):
        ...
    
    def delete_hold_request(self):
        ...
    
    
