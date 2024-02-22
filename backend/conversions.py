import isbnlib
import hashlib

def convert_isbn(inputISBN):
    if isbnlib.is_isbn10(inputISBN):
        isbn10_list = list(inputISBN)[:-1] 
        # converts isbn into list, then removes the checksum which will be added at the end
        isbn10_list = ['9', '7', '8', '-'] + isbn10_list
        # adds isbn-13 prefix number
        checksum = 0
        hyphen = 0
        for n in range(len(isbn10_list)):
            if not isbn10_list[n] == '-':
                checksum += int(isbn10_list[n]) * (((n-hyphen)%2)*2 + 1) # this last bit alternates between a 1 and a 3
            else:
                hyphen += 1
        # sums up all the numbers and multiplies them by an alternating 1 and 3, and keeps track of hyphens to remove them from the running tally of what number to multiply by next
        checksum = (10 - checksum%10)%10
        isbn10_list.append(str(checksum))
        isbn13 = ''.join(isbn10_list)
        return isbn13
    elif isbnlib.is_isbn13(inputISBN):
        return inputISBN
    else:
        return None

def hash_password(password):
    hashedPassword = hashlib.md5(password.encode()).hexdigest()
    return hashedPassword