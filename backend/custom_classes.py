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
        try:
            try:
                self.cover_image = self.isbnapi.cover(isbn13)['thumbnail']
            except:
                self.cover_image = self.isbnapi.cover(isbn13)['thumbnail']
        except:
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
    def __init__(self, input_fname : str, input_lname : str, input_password : str, input_schoolYear : int, input_username : str, perms: str, email :str):
        self.username = input_username
        self.password = input_password
        self.firstName = input_fname
        self.lastName = input_lname
        self.schoolYear = input_schoolYear
        # users have the following permissions: ADMIN (editing/creating/deleting other users), CATALOGUE MANAGER (create/remove books), LIBRARIAN (check in/out books, manage hold requests), MEMBER (create hold requests)
        self.permissions = perms
        self.email = email

class BookConditions:
    def __init__(self , isbn = -1, title = '', availability = -1, genreId = -1, sortBy = None, ascending = True, bookId=-1):
        # integers the default value -1, and strings have the default value of am empty string. do not edit these as i use them in db.py to either select entries with that value or ones without 
        self.isbn = isbn
        self.title = title + ('%s' if not title == '' else '')
        self.availability = availability
        self.genreId = genreId
        self.sortBy = sortBy
        self.ascending = ascending
        self.bookId = bookId
    
class UserConditions:
    def __init__(self, schoolYear = -1, firstName = '', lastName = '', username='', sortBy = None, ascending = True, userId = -1):
        # integers the default value -1, and strings have the default value of am empty string. do not edit these as i use them in db.py to either select entries with that value or ones without 
        self.schoolYear = schoolYear
        self.firstName = firstName
        self.lastName = lastName
        self.username = username
        self.sortBy = sortBy
        self.ascending = ascending
        self.userId = userId

