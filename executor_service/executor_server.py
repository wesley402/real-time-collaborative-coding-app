import executor_utils as eu
import json
import sys
from flask import Flask
from flask import request
from flask import jsonify

app = Flask(__name__)

@app.route('/')
def hello():
    return 'ss World'

@app.route('/build_and_run', methods=['POST'])
def build_and_run():
    data = json.loads(request.data.decode())

    if 'code' not in data or 'lang' not in data:
        return 'You should provide both code and lang'

    code = data['code']
    print(code)
    lang = data['lang']

    print('API get c alled with code %s in %s' % (code, lang))

    result = eu.build_and_run(code, lang)
    print(result)
    return jsonify(result)

if __name__ == '__main__':
    eu.load_image()
    # port = int(sys.argv[1])
    # print("Executor running on: %d" % port)
    app.run()
