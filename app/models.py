"""
yRelocate: This modules parses the csv files and insert it in MongoDb

"""

import os
import pandas as pd
import json
from geopy.geocoders import Nominatim
from app import app

def resource_path(file_path) :
    return app.config['basedir'] + file_path 

def mongo_db() :
    return app.config['pymongo_db'].db


def remove_population_collection():
    mongo_db()['population'].remove()
    return


def insert_population_data(recreate_db = False):
    """
        Inserts population data into database
        clears existing data if recreate_db = True
    """
    if (recreate_db):
        remove_population_collection()

    # Convert it to Json
    try:
        # Read from the population CSV file #####################################
        geolocator = Nominatim()
        population_df = pd.read_csv( 
            resource_path("/static/resources/USTexasPoulationAustin.csv"),
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
            if (mongo_db()['population']
                        .find({"place_id": location.raw["place_id"]})
                        .count() == 0):
                print(records)
                mongo_db()['population'].insert(records)
            else:
                print("updating")
            mongo_db()['population'].update({"place_id": records["place_id"]},
                records, upsert=True)
    except Exception as e:
        print(e)


def retrieve_population_data():
    result = mongo_db()['population'].find({}, {'_id': False})
    print (result)
    return result

# def retrieve_zip_geojson



def insert_home_rental_data(recreate_db = False):
    ''' reads the home and rental data from CSV and inserts
        it in mongodb 
        clears existing data if recreate_db = True
    '''
    # mongo_db().housing.remove()

    # Define geolocator to get lat long
    geolocator = Nominatim(user_agent="yRelocate")

    # get housing data
    df = pd.read_csv(
        resource_path("/static/resources/zip_singlefamily_home.csv"), 
        index_col = 0)
    home_df = pd.DataFrame()
    # Filter the colums
    home_df[['ZipCode','City', 'State', 'Metro', 'CountyName', 'AveHomePrice']] = df[ ['RegionName','City', 'State', 'Metro', 'CountyName', '2018-09']]

    # Get the rental data
    df = pd.read_csv("./static/resources/Zip_MedianRentalPrice_1Bedroom.csv", index_col = 0)
    rental_df = pd.DataFrame()
    rental_df[['City', 'State', 'Metro', 'CountyName', 'AveRentPrice']] = df[ ['City', 'State', 'Metro', 'CountyName', '2018-09']]    
    rental_df['ZipCode'] = rental_df.index

    # Merge the data 
    housing_df = home_df.merge(rental_df[['ZipCode', 'AveRentPrice']], left_on='ZipCode', right_on='ZipCode', how='left')

    #Search only for Austin
    housing_df = housing_df[housing_df['ZipCode'] > 70000]

    print(housing_df.head())
    ## Convert it to Json
    for not_used_idx, row in housing_df.iterrows():
        # print(row['ZipCode'])
        zipCode = str(row['ZipCode']).zfill(5)
        print(f"{zipCode}")
        if (mongo_db().housing.find({"ZipCode": zipCode}).count() == 0):
            print(f"Not Found {zipCode}")
            try:
                location = geolocator.geocode(zipCode)
            except TimeoutError:
                return False
            except:
               return False 

            # # print(column.strip().split()[0])
            if (location):
                record = {
                            "place_id" : location.raw["place_id"],
                            "ZipCode": zipCode,
                            "coordinates": [location.raw["lat"], location.raw["lon"]],
                            "Address" : [row['City'], row['State']],
                            "CountyName" : row['CountyName'],
                            "display_name" : location.raw["display_name"],
                            "boundingbox" : location.raw["boundingbox"],
                            "AveHomePrice":row['AveHomePrice'],
                            "AveRentPrice":row['AveRentPrice']                   
                            }
                # mongo_db()housing.update( {"place_id": location.raw["place_id"]}, {'$set':{record}}, {'upsert': True} )
                if (mongo_db().housing.find({"place_id": location.raw["place_id"]}).count() == 0):
                    print(f"Inserting {zipCode}")
                    mongo_db().housing.insert(record)
    return False

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

def insert_school_data(filename, collection):
    ''' reads the home and rental data from CSV and inserts
        it in mongodb 
        input: takes mongodb client '''
    # collection.remove()

    # Define geolocator to get lat long
    geolocator = Nominatim(user_agent="yRelocate")

    # get housing data
    df = pd.read_csv(
            resource_path("/static/resources/") + filename, 
            index_col = 0)
    school_df = pd.DataFrame()
    # Filter the colums
    school_df = df[['Campus Name', 'District', 'County', 'Grade Range', 'Charter?', 'Magnet?', 'C@R Grade', 'State Rank', 'Regional Rank']]


    print(school_df.head())
    ## Convert it to Json
    for index, row in school_df.iterrows():
        # print(f"{row['Campus Name']}  {row['County']}")
        if (collection.find({"campusid": index}).count() == 0):
            # print(f"Not Found {row['Campus Name']}")
            try:
                location = geolocator.geocode(f"{row['Campus Name']}")
            except TimeoutError:
                return False

            # # print(column.strip().split()[0])
            if (location):
                print(f"found {row['Campus Name']}")
                record = {
                            "place_id" : location.raw["place_id"],
                            "ZipCode": location.raw['display_name'].split(", ")[-2],
                            "campusid": index,
                            "coordinates": [location.raw["lat"], location.raw["lon"]],
                            "CountyName" : row['County'],
                            "display_name" : location.raw["display_name"],
                            "boundingbox" : location.raw["boundingbox"],
                            "Grade_Range":row['Grade Range'],
                            "Charter":row['Charter?'],
                            "Magnet":row['Magnet?'],  
                            "CaR_Grade":row['C@R Grade'],
                            "state_Rank":row['State Rank'],      
                            "reginal_rank":row['Regional Rank']                                                                                                      
                            }
                # mongo_db().housing.update( {"place_id": location.raw["place_id"]}, {'$set':{record}}, {'upsert': True} )
                if (collection.find({"place_id": location.raw["place_id"]}).count() == 0):
                    print(f"Inserting {location.raw['display_name']}")
                    collection.insert(record)
            else:
                print(f"Not found {row['Campus Name']}")
    return True
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

def retrive_population_data():
    ''' 
        retrieves population data from mongodb and returns the result
        returns: mongodb cursor
    '''    

    #sort = [('_id', -1)]
    result = mongo_db().population.find({}, {'_id': False})
    #print (result)
    if result.count():
        return result

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
   result = mongo_db().housing.find({}, {'_id': False})
   #print (result)
   if result.count():
       return result

   return None





