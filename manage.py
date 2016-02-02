#!/usr/bin/env python
import pytest
from flask.ext.migrate import MigrateCommand
from flask.ext.script import Manager, Server
from flask.ext.script.commands import ShowUrls, Clean

from scrappyr.app import create_app
from scrappyr.common import db


manager = Manager(create_app)

# Options passed to `create_app`.
manager.add_option('-c', '--config-file', dest='config_file', required=False,
                   help="Configuration file (*.py or *.json) for Flask app.")
manager.add_option('-d', '--db-uri', dest='db_uri', required=False,
                   help="SQLAlchemy database URI.")

manager.add_command('server', Server())
manager.add_command('db', MigrateCommand)
manager.add_command('show-urls', ShowUrls())
manager.add_command('clean', Clean())


@manager.shell
def make_shell_context():
    """Open ipython with several default imports in the context of the app."""
    return dict(app=manager.app, db=db)


@manager.command
def test():
    pytest.main('.')


if __name__ == '__main__':
    manager.run()
