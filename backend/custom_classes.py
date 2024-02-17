class Book:
    import isbntools.app as isbnapi
    def __init__(self, isbn13, genre_name):
        self.isbn = isbn13
        book_meta = self.isbnapi.meta(isbn13)
        self.title = book_meta['Title']
        self.genre_name = genre_name
        self.genre_id = 0 # will set to 0 until real value is found in db.py
        self.publication_date = book_meta['Year']
        self.author_name = book_meta['Authors'][0]
        self.author_id = 0 # will set to 0 until real value is found in db.py
        self.publisher_name = book_meta['Publisher']
        self.publisher_id = 0 # will set to 0 until real value is found in db.py
        self.description = self.isbnapi.desc(isbn13)
        self.cover_image = self.isbnapi.cover(isbn13)
        if self.cover_image == {}:
            print('no cover image')
            self.cover_image = 'NONE'
    
# from isbntools.app import *
# got from this stackoverflow thread https://stackoverflow.com/a/26360917
# created error where it did not have a module called pkg resources, so i installed python setuptools

# isbn = '9780486602554'

# # services i can use: [wcat|goob|openl|isbndb|merge]
# meta_dict = meta(isbn)

# print(meta_dict)
# print(cover(isbn))
# print(desc(isbn))
        

class User:
    def __init__(input_fname : str, input_lname : str, input_password : str, input_schoolYear : int, input_username : str):
        username = input_username
        password = input_password
        firstName = input_fname
        lastName = input_lname
        schoolYear = input_schoolYear
        permissions = '0000'