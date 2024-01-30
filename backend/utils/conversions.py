def convert_isbn(isbn10):
    isbn10_list = list(isbn10)[:-1] 
    # converts isbn into list, then removes the checksum which will be added at the end
    isbn10_list = ['9', '7', '8', '-'] + isbn10_list
    # adds isbn-13 prefix number
    checksum = 0
    hyphen = 0
    for n in range(len(isbn10_list)):
        if not isbn10_list[n] == '-':
            checksum += int(isbn10_list[n]) * (((n-hyphen)%2)*2 + 1)
        else:
            hyphen += 1
    checksum = (10 - checksum%10)%10
    isbn10_list.append(str(checksum))
    return ''.join(isbn10_list)
