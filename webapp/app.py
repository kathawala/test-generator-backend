import json
import os
from urllib.parse import urlparse, urljoin

from generateScript import generateScript

from flask import Flask, request, make_response, session, g, redirect, url_for, abort, render_template, flash
from sqlite3 import dbapi2 as sqlite3
from flask_sqlalchemy import SQLAlchemy
from flask_login import login_required, LoginManager
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

app.config.update(dict(
    # DATABASE=os.path.join(app.root_path, 'sqlite.db'),
    SQLALCHEMY_DATABASE_URI='sqlite:///' + os.path.join(app.root_path, 'sqlite.db'),
    SQLALCHEMY_TRACK_MODIFICATIONS=False
))

db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)

#####                        #####
#####  Database Models/Tbls  #####
#####                        #####

# functions in classes come from this setup pattern for flask login
# https://realpython.com/blog/python/using-flask-login-for-user-management-with-flask/

class User(db.Model):

    __tablename__ = 'user'

    # This pattern is for flask_sqlalchemy
    # it represents the User table in the database
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    hashed_password = db.Column(db.String)
    authenticated = db.Column(db.Boolean, default=False)

    def __init__(self, username, password):
        self.username = username
        self.hashed_password = generate_password_hash(password)
        
    def __repr__(self):
        return '<User %r>' % self.username

    def is_active(self):
        return True
        
    def get_id(self):
        return self.username
        
    def is_authenticated(self):
        return self.authenticated

    def is_anonymous(self):
        return False
    
    
class Snippet(db.Model):

    # This pattern is for flask_sqlalchemy
    # it represents the Snippet table in the database
    id = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.Integer, db.ForeignKey('user.id'))
    json_data = db.Column(db.String)

    def __init__(self, userid, json_data):
        self.userid = userid
        self.json_data = json_data

    def __repr__(self):
        return '<Userid %r> | <Json %r>' % (self.userid, self.json_data)

#####                   #####
#####  Login Functions  #####
#####                   #####

@login_manager.user_loader
def user_loader(username):
    return User.query.get(username)

@app.route('/login', methods=['POST'])
def login():
    error = None
    username = request.form['username']
    password = request.form['password']
    user = User.query.get(username)
    if check_password_hash(user.hashed_password, password):
        user.authenticated = True
        db.session.add(user)
        db.session.commit()
        login_user(user, remember=True)
        if request.referrer and is_safe_url(request.referrer):
            return redirect(request.referrer)
        else:
            return make_response(open('templates/index.html').read())
    # else:
        # error = 
        
def is_safe_url(url):
    ref_url = urlparse(request.host_url)
    test_url = urlparse(urljoin(request.host_url, target))
    return test_url.scheme in ('http', 'https') and ref_url.netloc == test_url.netloc

#####                   #####
##### Routing Functions #####
#####                   #####

@app.route('/', methods=['GET'])
def main():
    # return make_response(open('templates/index.html').read())
    return render_template('index.html')
    
# @app.route('/', methods=['GET', 'POST'])
@app.route('/generate', methods=['POST'])
def generate():
    # if request.method == 'GET':
        # render_template(...) #still todo
    # else:
        ## validate json here
        # data = request.json
        # script = generateScript(data)
        # print(script)
    data = request.get_json()
    script = generateScript(data)
    return script

@app.route('/snippet', methods=['GET','POST'])
@login_required
def snippet_handling():
    if request.method == 'GET':
        pass
    elif request.method == 'POST':
        pass
    else:
        pass

#####                        #####
##### Command Line Functions #####
#####                        #####

# def get_db():
#     if not hasattr(g, '_database'):
#         db = g._database = sqlite3.connect(app.config['DATABASE'])
#     return db

# @app.teardown_appcontext
# def close_db(exception):
#     if hasattr(g, '_database'):
#         g._database.close()

# def init_db():
#     db = get_db()
#     with app.open_resource('schema.sql', mode='r') as f:
#         db.cursor().executescript(f.read())
#     db.commit()

# @app.cli.command('initdb')
# def initdb_command():
#     """Initializes the database."""
#     init_db()
#     print('Initialized the database.')