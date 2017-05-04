import json
from generateScript import generateScript
from flask import request
from flask import make_response
from flask import Flask

app = Flask(__name__)

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