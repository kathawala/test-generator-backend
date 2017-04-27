import json
import tempfile
import os
from subprocess import call
from flask import Flask

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def main():
    if request.method == 'GET':
        render_template(...) #still todo
    else:
        ## validate json here
        data = request.json
        generate_script(data)


