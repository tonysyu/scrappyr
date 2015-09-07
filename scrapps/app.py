from flask import Flask
# Change this to HerokuConfig if using Heroku.
from flask.ext.appconfig import AppConfig
from flask.ext.migrate import Migrate
from flask.ext.sqlalchemy import SQLAlchemy

from .views import scrapps


SQLALCHEMY_DATABASE_URI = "sqlite:////tmp/scrapps.db"
DEBUG = True
SECRET_KEY = 'development-key'

db = SQLAlchemy()
migrate = Migrate()
config = AppConfig()


def create_app():
    app = Flask(__name__)
    app.config.from_object(__name__)
    app.register_blueprint(scrapps)

    config.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    with app.app_context():
        db.create_all()

    return app
