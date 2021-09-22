from flask import Flask, send_from_directory, request
from flask.wrappers import Request
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS #comment this on deployment
from csv import DictReader
from urllib.parse import urlparse

import json
import redis
import pickle

REDIS_URL = 'rediss://:pd936ec22e8bfbe40bff552cb5b1abeff0970e018cfe104b5b15bb5f810c82a0e@ec2-3-82-185-17.compute-1.amazonaws.com:23820'

url = urlparse(REDIS_URL)
r = redis.Redis(host=url.hostname, port=url.port, username=url.username, password=url.password, ssl=True, ssl_cert_reqs=None)

app = Flask(__name__, static_url_path='', static_folder='../frontend/build')
CORS(app) #comment this on deployment
api = Api(app)

@app.route("/", defaults={'path':''})
def serve(path):
    return send_from_directory(app.static_folder,'index.html')

@app.route("/api/test")
def api_test():
    return "test successful"


@app.route("/api/getRoster")
def get_roster():
    roster = r.get("roster")
    if roster:
        roster_obj = [row for row in DictReader(roster.decode('utf-8').splitlines())]
        return json.dumps(roster_obj)

    return json.dumps({"error": "no roster found!"})
    

@app.route("/api/uploadRoster", methods=['POST'])
def upload_roster():
    file = request.files.get('file')
    text = file.read().decode('utf-8')
    try:
        reader = DictReader(text.splitlines())
        for row in reader:
            print(row)
    except Exception as e:
        print(e)

    r.set("roster", text)

    return json.dumps({
        "status": "done"
    })