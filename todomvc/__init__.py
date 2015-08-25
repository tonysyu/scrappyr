from flask import Flask

from .extensions import db, migrate, config
from .views import todomvc


SQLALCHEMY_DATABASE_URI = "sqlite:////tmp/todomvc.db"
DEBUG = True
SECRET_KEY = 'development-key'


def create_app():
    app = Flask(__name__)
    app.config.from_object(__name__)
    app.register_blueprint(todomvc)

    config.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    with app.app_context():
        db.create_all()

    return app
