from flask import Flask, jsonify, render_template, url_for
import json
from bson import json_util

# import app
from app import app
# from app import retrieve_population_data
from app import models

# ########################################################################



# Define routes ###############################################################
@app.route("/")
@app.route('/index.html')
def index():
    return render_template('index.html')

@app.route('/population')
def population():
    print("---------------population-----------------")
    # Get the Data from mongodb
    projects = models.retrieve_population_data()
    json_projects = []
    for project in projects:
        json_projects.append(project)
    json_projects = json.dumps(json_projects, default=json_util.default)
    return json_projects
    # return 'More to come!! - Population dump!'

# ###########################################################################
# ###########################################################################

if __name__ == '__main__':
    app.run(debug=True)

# insert_population_data(mongo)

# from app import retrieve_population_data