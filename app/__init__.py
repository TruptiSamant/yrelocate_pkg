from flask import Flask
import os

app = Flask(__name__)

# 
app.config["MONGO_URI"] = 'mongodb://joe_reynolds:op3nupd4n@ds155903.mlab.com:55903/heroku_j29mjxk2'
# "mongodb://ds155903.mlab.com:55903/heroku_j29mjxk2 -u heroku_j29mjxk2  -p op3nupd4n"
# "mongodb://localhost:27017/yrelocate_db"
# 
# ds155903.mlab.com:55903/heroku_j29mjxk2 -u <dbuser> -p <dbpassword>
# mongodb://<dbuser>:<dbpassword>@ds155903.mlab.com:55903/heroku_j29mjxk2

# Set base directory ##################################################
app.config['basedir'] = os.path.abspath(os.path.dirname(__file__))

from flask_pymongo import PyMongo
# store the PyMongo/MongoDBB client object in the flask app.config
app.config['pymongo_db'] = PyMongo(app)

from app import routes, models
# import app