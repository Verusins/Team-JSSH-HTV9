import pprint
import ast

from pymongo import MongoClient
import pymongo
from bson.objectid import ObjectId

def connect_to_mongoDB(uri):
    try:
        client = MongoClient(uri, server_api=pymongo.server_api.ServerApi(
        version="1", strict=True, deprecation_errors=True))
        # end example code here
        client.admin.command("ping")
        print("Connected successfully")
        return client

    except Exception as e:
        raise Exception(
            "The following error occurred: ", e)
def read_and_parse_file(file_path):
    """
    Safely reads a string from a text file and converts it into a list of dictionaries.
    
    :param file_path: The path to the text file containing the string representation of a list of dictionaries.
    :return: A list of dictionaries if parsing is successful, otherwise None.
    """
    try:
        # Step 1: Read the file content
        with open(file_path, 'r', encoding='utf-8') as file:
            file_content = file.read()

        # Step 2: Safely parse the content using ast.literal_eval
        data = ast.literal_eval(file_content)
        
        # Ensure that the parsed data is indeed a list of dictionaries
        if isinstance(data, list) and all(isinstance(item, dict) for item in data):
            return data
        else:
            raise ValueError("Parsed content is not a list of dictionaries.")
            
    except (SyntaxError, ValueError, IOError) as e:
        print(f"An error occurred while reading or parsing the file: {e}")
        return None

def upload (fp, client):
    db = client.history
    history_collection = db.singleton
    content = read_and_parse_file(fp)
    print(type(content))

if __name__ == "__main__":
    uri = "mongodb+srv://wangyukun721:ii4GZUByt7WrDxLL@cluster0.ld92j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

    with connect_to_mongoDB(uri) as client:
        db = client.history
        history_collection = db.singleton
        file_path = 'test.txt'
        content = read_and_parse_file(file_path)
        print(type(content))
        result = history_collection.insert_one(content)
        document_id = result.inserted_id
        print(f"_id of inserted document: {document_id}")
        client.close()

        