import json
import os
from generateScript import generateScript
from flask import Flask, request, make_response, session, g, redirect, url_for, abort, render_template, flash
from sqlite3 import dbapi2 as sqlite3
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config.update(dict(
    # DATABASE=os.path.join(app.root_path, 'sqlite.db'),
    SQLALCHEMY_DATABASE_URI='sqlite:///' + os.path.join(app.root_path, 'sqlite.db'),
    SQLALCHEMY_TRACK_MODIFICATIONS=False
))

db = SQLAlchemy(app)

#####                        #####
#####  Database Models/Tbls  #####
#####                        #####

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    hashed_password = db.Column(db.String)
    authenticated = db.Column(db.Boolean, default=False)
    def __init__(self, username):
        self.username = username
    def __repr__(self):
        return '<User %r>' % self.username

class Snippet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.Integer, db.ForeignKey('user.id'))
    json_data = db.Column(db.String)

    def __init__(self, userid, json_data):
        self.userid = userid
        self.json_data = json_data

    def __repr__(self):
        return '<Userid %r> | <Json %r>' % (self.userid, self.json_data)

#####                   #####
##### Routing Functions #####
#####                   #####

@app.route('/', methods=['GET'])
def main():
    return make_response(open('templates/index.html').read())

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