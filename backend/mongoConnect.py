import pprint
import ast
from fastapi import APIRouter

from pymongo import MongoClient
import pymongo
from bson.objectid import ObjectId
from pydantic import BaseModel

class MeetingRecord(BaseModel):
    name: str
    role: str
    content: str

router = APIRouter()


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

def upload_txt (fp, client):
    db = client.history
    history_collection = db.singleton
    content = read_and_parse_file(fp)
    for dictionary in content:
        db.singleton.insert_one(dictionary)
    print("upload success")

def upload_json(jsonFile, client):
    db = client.history
    history_collection = db.singleton
    for dictionary in jsonFile:
        db.singleton.insert_one(dictionary)
    print("upload success")

def format_meeting_records(documents):
    """
    Converts a list of MongoDB documents into a human-readable string format, 
    separating each meeting by the 'TERMINATE' marker and formatting each speaker's content.
    
    :param documents: List of dictionaries containing 'content', 'role', and 'name'.
    :return: A string that organizes the content into separate meetings, formatted for readability.
    """
    meetings = []
    current_meeting = []
    
    for document in documents:
        content = document['content'].strip()
        role = document['role']
        name = document['name']
        
        # If the document's content is 'TERMINATE', finalize the current meeting and start a new one
        if content == 'TERMINATE':
            meetings.append('\n'.join(current_meeting))  # Finalize the current meeting
            current_meeting = []  # Reset for the next meeting
        else:
            # Format each speaker's contribution
            formatted_entry = f"{name} ({role}):\n{content}\n"
            current_meeting.append(formatted_entry)
    
    # If there's leftover content after the last 'TERMINATE', finalize it
    if current_meeting:
        meetings.append('\n'.join(current_meeting))
    
    # Combine all meetings with a separator between them
    formatted_output = "\n\n=== New Meeting ===\n\n".join(meetings)
    
    return formatted_output

@router.get("/read_history/")
async def download_from_db(client = None):  # Dependency injection
    """
    Downloads the entire meeting history from MongoDB and returns it as a formatted string.
    """

    if client is None:
        # Connect to MongoDB if client is not provided through dependency injection
        client = connect_to_mongoDB(uri="mongodb+srv://wangyukun721:@cluster0.ld92j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = client.history
    history_collection = db.singleton
    result = history_collection.find({}, {"content": 1, "role": 1, "name": 1, "_id": 0})  # Project relevant fields
    meetings = format_meeting_records(result)
    # Close the connection if not using dependency injection
    if client is not None:
        client.close()

    return meetings


if __name__ == "__main__":
    uri = "mongodb+srv://wangyukun721:@cluster0.ld92j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

    # with connect_to_mongoDB(uri) as client:
    #     meetings = download_from_db(client)
    #     print(meetings)
    #     client.close()

        