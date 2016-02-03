# Change this to HerokuConfig if using Heroku.
from flask.ext.migrate import Migrate
from flask.ext.sqlalchemy import SQLAlchemy


__all__ = ['db', 'migrate']


db = SQLAlchemy()
migrate = Migrate()
