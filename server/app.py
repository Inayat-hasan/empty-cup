from flask import Flask
from flask_cors import CORS
from database.connection import connectDB
from dotenv import load_dotenv
from routes.designer_route import designer_bp

load_dotenv()

app = Flask(__name__)

CORS(app,resources={r"/*": {"origins": "https://cup-empty.netlify.app"}})

db = connectDB()

app.register_blueprint(designer_bp)


@app.route("/")
def home():
    return "Hello from Flask + MongoDB!"


if __name__ == "__main__":
    app.run(debug=True)
