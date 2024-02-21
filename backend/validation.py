import re

def validate_password(password):
    # USED CHEATSHEET FROM https://pythex.org/
    # password must contain the following: 1 number, 1 upper case character, be fully alpha-numeric (removed special characters for easier security filtering.)
    pattern = re.compile(r"^(?=.{7,15}$)(?=.*[A-Z])(?=.*[a-z])(?=.*\d)")
    return not pattern.match(password) == None

def validate_email(email):
    # COPIED RFC2822 EMAIL FORMAT REGEX
    # source: https://regex-generator.olafneumann.org/?sampleText=email%40mail.com&flags=i
    pattern = re.compile(r"[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?", re.IGNORECASE)
    return not pattern.match(email) == None

def validate_username(username):
    pattern = re.compile(r"[a-z0-9]+")
    return not pattern.match(username) == None