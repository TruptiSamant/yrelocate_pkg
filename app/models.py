"""
yRelocate: This modules parses the csv file and insert it in MongoDb

"""

import os
import pandas as pd
import json
from geopy.geocoders import Nominatim
from app import app


def remove_population_collection():
    db_population = app.config['pymongo_db'].db['population']
    db_population.remove()
    return


def insert_population_data(recreate_db = False):

    if (recreate_db):
        remove_population_collection()

    # Convert it to Json
    try:
        # Read from the population CSV file #####################################
        geolocator = Nominatim()
        population_df = pd.read_csv(app.config['basedir'] +
                                    "/static/resources/USTexasPoulationAustin.csv",
                                    index_col=0)
        for column in population_df:
            records = json.loads(population_df[column].T
                                 .to_json(orient='index'))
            location = geolocator.geocode(column.strip().split()[0])
            # print(column.strip().split()[0])
            records = {
                "place_id": location.raw["place_id"],
                "coordinates": [location.raw["lat"],
                                location.raw["lon"]],
                "place": column.strip().split()[0],
                "type": column.strip(),
                "display_name": location.raw["display_name"],
                "boundingbox": location.raw["boundingbox"],
                "data": records
                }
            # Insert only if place does not exist
            if (app.config['pymongo_db'].db['population']
                        .find({"place_id": location.raw["place_id"]})
                        .count() == 0):
                print(records)
                app.config['pymongo_db'].db['population'].insert(records)
            else:
                print("updating")
            app.config['pymongo_db'].db_['population'].update({"place_id": records["place_id"]},
                records, upsert=True)
    except Exception as e:
        print(e)


def retrieve_population_data():
    db_population = app.config['pymongo_db'].db['population']
    result = db_population.find({}, {'_id': False})
    print (result)
    if result.count():
        return result
    else:
        return None


    # sort = [('_id', -1)]
# insert_population_data()
# cursor =list(db.retrive_population_data())
# for i in cursor:
#     print(i['coordinates'])
def retrive_housing_data(mongo):
   ''' retriveds population data from mongodb and returns the result
       input: takes mongodb client
       return: mongodb cursor'''

   #sort = [('_id', -1)]
   result = mongo.db.housing.find({}, {'_id': False})
   #print (result)
   if result.count():
       return result

   return None





