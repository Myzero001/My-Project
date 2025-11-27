from flask import Flask
from config import Config
from extensions import db
from flask_migrate import Migrate
from flask_cors import CORS  
from routes import main

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app) 
    routes(app)
    extensions(app)
    return app

def extensions(app):
    db.init_app(app)
    migrate = Migrate(app, db)

def routes(app):
    app.register_blueprint(main)

if __name__ == '__main__':
    app = create_app()
    app.run('127.0.0.1', 5001)
