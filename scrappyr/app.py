from flask import Flask

from .common import config, db, migrate
from .controllers import scrappyr


DEBUG = True
SECRET_KEY = 'development-key'
SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/scrappyr.db'


def create_app(flask_config=None):
    """Return Flask app for scrappyr.

    Parameters
    ----------
    flask_config : object
        Object (or string pointing to object---e.g. module) containing
        configuration for flask app. See [1]_ for possible configuration
        values. Defaults to the name of this module, which means module
        variables in this file are used for configuration by default.

    References
    ----------
    .. [1] http://flask.pocoo.org/docs/0.10/config/#builtin-configuration-values
    """
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
