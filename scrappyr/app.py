import os.path

from flask import Flask
from flask.ext.migrate import Migrate

from .common import db
from .controllers import scrappyr


DEBUG = True
SECRET_KEY = 'development-key'
SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/scrappyr.db'


def create_app(config_obj=None, config_file=None, db_uri=None,
               with_webpack_dev_server=False):
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

    config_file = os.path.abspath(config_file)
    _update_config_from_file(app, config_file)

    if with_webpack_dev_server:
        webpack_dev_server_url = 'http://localhost:8080'
        print('')
        print('`--with-webpack-dev-server` was set so you should run:')
        print('    `python manage.py webpack_dev_server`')
        print('')
    else:
        webpack_dev_server_url = ''
    app.config['WEBPACK_DEV_SERVER_URI'] = webpack_dev_server_url

    if db_uri is not None:

        app.config['SQLALCHEMY_DATABASE_URI'] = db_uri

    app.register_blueprint(scrappyr)

    _init_db(app)

    return app


def _update_config_from_file(app, config_file):
    if config_file is None:
        return

    file_ext = _get_ext(config_file)

    if file_ext in ('.py', '.cfg'):
        app.config.from_pyfile(config_file)
    elif file_ext == '.json':
        try:
            app.config.from_json(config_file)
        except AttributeError:
            raise RuntimeError("JSON config file requires Flask >= 0.11")
    else:
        msg = "Expected extension .py or .json for config file: {}"
        raise ValueError(msg.format(config_file))


def _init_db(app):
    db.init_app(app)

    migrate = Migrate()
    migrate.init_app(app, db)

    with app.app_context():
        db.create_all()


def _get_ext(path):
    basename, ext = os.path.splitext(path)
    return ext
