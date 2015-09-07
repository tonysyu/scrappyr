#!/usr/bin/env python
import pytest
from flask.ext.script import Manager, Server
from flask.ext.migrate import MigrateCommand
from flask.ext.script.commands import ShowUrls, Clean

from scrappyr.app import create_app
from scrappyr.common import db


app = create_app()
manager = Manager(app)
manager.add_command('server', Server())
manager.add_command('db', MigrateCommand)
manager.add_command('show-urls', ShowUrls())
manager.add_command('clean', Clean())


@manager.shell
def make_shell_context():
    """Open ipython with several default imports in the context of the app."""
    return dict(app=app, db=db)


@manager.command
def test():
    pytest.main('.')


if __name__ == '__main__':
    manager.run()
