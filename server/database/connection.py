from mongoengine import connect
import os

connection = None
def connectDB():
    connection = connect(host=os.getenv("MONGODB_URI"), db="emptyCup")
    if (connection):
        print("Connected to MongoDB")
    return connection
