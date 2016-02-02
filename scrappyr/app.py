from flask import Flask

from .common import config, db, migrate
from .controllers import scrappyr


DEBUG = True
SECRET_KEY = 'development-key'
SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/scrappyr.db'


def create_app(config_obj=None, config_file=None, db_uri=None):
    """Return Flask app for scrappyr.

    Parameters
    ----------
    config_obj : object
        Object (or string pointing to object---e.g. module) containing
        configuration for flask app. Defaults to the name of this module, which
        means module variables in this file are used for configuration by
        default. See [1]_ for possible configuration values.
    config_file : str
        File containing configuration for flask app. Overrides configuration
        values in `config_obj`. See [1]_ for possible configuration values.
    db_uri : str
        SQLAlchemy database URI. Overrides databases specified by
        `config_obj` and `config_file`. See [2]_ and [3]_.

    References
    ----------
    .. [1] http://flask.pocoo.org/docs/0.10/config/#builtin-configuration-values
    .. [2] http://flask-sqlalchemy.pocoo.org/2.1/config/#configuration-keys
    .. [3] http://flask-sqlalchemy.pocoo.org/2.1/config/#configuration-keys
    """
    config_obj = __name__ if config_obj is None else config_obj

    app = Flask(__name__)
    app.config.from_object(config_obj)

    _update_config_from_file(app, config_file)

    if db_uri is not None:
        app.config['SQLALCHEMY_DATABASE_URI'] = db_uri

    app.register_blueprint(scrappyr)

    config.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    with app.app_context():
        db.create_all()

    return app


def _update_config_from_file(app, config_file):
    if config_file is None:
        return

    if config_file.endswith('.py'):
        app.config.from_pyfile(config_file)
    elif config_file.endswith('.json'):
        try:
            app.config.from_json(config_file)
        except AttributeError:
            raise RuntimeError("JSON config file requires Flask >= 0.11")
    else:
        msg = "Expected extension .py or .json for config file: {}"
        raise ValueError(msg.format(config_file))
