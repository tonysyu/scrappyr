from flask import Flask

from .common import config, db, migrate
from .controllers import scrappyr


SQLALCHEMY_DATABASE_URI = "sqlite:////tmp/scrappyr.db"
DEBUG = True
SECRET_KEY = 'development-key'


def create_app(flask_config=None):
    flask_config = __name__ if flask_config is None else flask_config

    app = Flask(__name__)
    app.config.from_object(flask_config)
    app.register_blueprint(scrappyr)

    config.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    with app.app_context():
        db.create_all()

    return app
