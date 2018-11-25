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
    """
        returns all of the population only records
    """
    print("---------------population-----------------")
    # Get the Data from mongodb
    items = models.retrieve_population_data()
    json_items = []
    for item in items:
        json_items.append(item)
    json_items = json.dumps(json_items, default=json_util.default)
    return json_items

@app.route('/zip_geojson')
def get_zip_geojson():
    """
    return zip code geojson
    """
    zip_geojson = models.retrieve_zip_geojson()
    print(zip_geojson)
    return zip_geojson

# ###########################################################################
# ###########################################################################

if __name__ == '__main__':
    app.run(debug=True)

# insert_population_data(mongo)
#insert_home_rental_data(mongo)
# while (True):
#     if(insert_home_rental_data(mongo)):
#         break; 
#     else:
#         print("Trying again")
# insert_home_rental_data(mongo)

# insert_school_data("2018 Austin - High.csv", mongo.db.highschool)