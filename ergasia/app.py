from flask import Flask,request,jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId
import numpy as np
from pymongo import MongoClient
from itertools import chain

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb+srv://yro:123123123@cluster0.vblbwzh.mongodb.net/?appName=Cluster0"

try:
    uri = "mongodb+srv://yro:123123123@cluster0.vblbwzh.mongodb.net/?appName=Cluster0"
    client=MongoClient(uri)
    database=client["books_with_authors"]
    collection=database["books_with_authors"]


    mongo = PyMongo(app)

    db_books = collection
    db_books.create_index([("name", "text")])

    def serialize_book(book):
        return {
            "id": str(book["_id"]),
            "name": book.get("name"),
            "name_english": book.get("name_english"),
            "image": book.get("image"),
            "description": book.get("description"),
            "description_english": book.get("description_english"),
            "likes": book.get("likes",0),
            "price": book.get("price",0),
            "author": book.get("author"),
            "wikipedia_link_book": book.get("wikipedia_link_book"),
            "wikipedia_link_author": book.get("wikipedia_link_author")
        }

    @app.route('/')
    def home():
      return "API is running"


    @app.route('/search', methods=['GET'])
    def search_books():
        name_any_language = request.args.get("name", "")

        if name_any_language == "":
            books= db_books.find()
        else:

            #Search in both english and greek titles
            books1= db_books.find({"name": {"$regex": name_any_language, "$options":"i"}})
            books2= db_books.find({"name_english": {"$regex": name_any_language, "$options":"i"}})
            #Merge results
            books=chain(books1,books2)

        final_items=[serialize_book(b) for b in books]
        final_items=sorted(final_items, key=lambda x: x["name"], reverse=False)

        #Delete duplicates from greek and english results
        unique_data = []
        [unique_data.append(item) for item in final_items if item not in unique_data]

        return jsonify(unique_data)


    @app.route('/like', methods=['POST'])
    def increase_like():

        data = request.get_json()
        book_id = data["id"]

        if not book_id:
            return jsonify({"error": "Missing id"}), 400

        try:
            filter={"_id": ObjectId(book_id)}
            newvalues={"$inc": {"likes": 1}}

            result=db_books.update_one(
                filter,newvalues
            )
            if result.matched_count==0:
                return jsonify({"error": "Book not found"}), 404

            return jsonify({"message": "Like added"})

        except Exception:
            return jsonify({"error": "Invalid ID"}), 400

    @app.route('/popular', methods=['GET'])
    def get_popular():

        books=db_books.find().sort("likes",-1).limit(5)
        popular_books=[serialize_book(b) for b in books]

        return jsonify(popular_books)



    if __name__ == '__main__':
        app.run(host="127.0.0.1",port=5000,debug=True)

    client.close()

except Exception as e:
    raise Exception("The following error occurred:",e)
