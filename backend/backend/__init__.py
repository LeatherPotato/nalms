from flask import Flask, send_from_directory
import os
from backend import db

app = Flask(__name__, static_folder='client/build', static_url_path='build/')

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

@app.route('/api/')
def api_home():
    return 'welcome to the NALMS api'


if __name__ == '__main__':
    app.run(debug=True, port=8080)


# i am a good person
# i am a powerful person
# i dont believe in evil
# i think that evil is an idea created by others to avoid dealing with their own nature
# i understand my own nature
# i understand myself
# i control myself
# i control everything within myself
# my domain is my domain
# i can lie on my back and affect the lives of those i love without moving a finger
# but i would only affect them in good ways
# i dont waste time in evi
# im a good perso
# is this thing on?
# do you know about jesus?
# do you really know?
# all you know is what youve been told
# listen with yoru heart
# sing with your heart
# youe just been singing about girls
# what do you know about girls
# fuck
# why are you so tense?
# youve gotta start singing with live in your heart
# is this on? adam are you there? a pain star has entered your house
# but what are you going to do about it?
# are you going to touch it? it only happens once very thousand years
# maybe even 2 thousand years
# and how long is a year really
# its almost halloween
# i havent done shit this year
# its been a summer
# its been summer since fgebuary
# i was in australia
# god
# california?
# then what
# june
# juuly
# august
# a month in europe?
# i cant even go to ikea anymore
# i got flashbacks
# fuck...
# you should see the lights that i gt there
# i think youd like them
# i think that
# i think youd like them a lot