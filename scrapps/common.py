# Change this to HerokuConfig if using Heroku.
from flask.ext.appconfig import AppConfig
from flask.ext.migrate import Migrate
from flask.ext.sqlalchemy import SQLAlchemy


__all__ = ['config', 'db', 'migrate']


config = AppConfig()
db = SQLAlchemy()
migrate = Migrate()
