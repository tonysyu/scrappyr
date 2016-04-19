#!/usr/bin/env python
import os
import subprocess
import webbrowser
from contextlib import contextmanager

import pytest
from flask.ext.migrate import MigrateCommand
from flask.ext.script import Manager, Server
from flask.ext.script.commands import ShowUrls, Clean

from scrappyr.app import create_app
from scrappyr.common import db


# Global constants
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
STATIC_ROOT = os.path.join(PROJECT_ROOT, 'scrappyr', 'static')
KARMA_EXEC = os.path.join(STATIC_ROOT, 'node_modules',
                          'karma-cli', 'bin', 'karma')
KARMA_CONFIG = os.path.join(STATIC_ROOT, 'karma.conf.js')
WEBPACK_DEV_SERVER_EXEC = os.path.join(STATIC_ROOT, 'node_modules',
                                       '.bin', 'webpack-dev-server')


manager = Manager(create_app)

# Options passed to `create_app`.
manager.add_option('-c', '--config-file',
                   help="Configuration file (*.py or *.json) for Flask app.")
manager.add_option('-d', '--db-uri',
                   help="SQLAlchemy database URI.")
manager.add_option('-w', '--with-webpack-dev-server', action='store_true',
                   help="Configure Flask app to run with webpack dev server")


manager.add_command('server', Server())
manager.add_command('db', MigrateCommand)
manager.add_command('show-urls', ShowUrls())
manager.add_command('clean', Clean())


class StartAndOpenServer(Server):

    help = description = ("Runs the Flask development server i.e. app.run() "
                          "and opens browser.")

    def __call__(self, *args, **kwargs):
        webbrowser.open('http://{host}:{port}/'.format(**kwargs))
        super().__call__(*args, **kwargs)

manager.add_command('start', StartAndOpenServer())


@manager.shell
def make_shell_context():
    """Open ipython with several default imports in the context of the app."""
    return dict(app=manager.app, db=db)


@manager.option('-s', '--skip-coverage', dest='skip_coverage',
                action='store_true', help="Display test-coverage summary")
def test(skip_coverage=False):
    """Run python test suite.

    If you want to run individual tests, run py.test directly. If you want to
    debug a test, turn off output capture with `-s`:

        py.test -s path/to/test.py::TestClass::test_method
    """
    opts = ['.']
    if not skip_coverage:
        opts.extend(['--cov', 'scrappyr',  '--cov-report', 'term-missing'])

    # Execute command in subprocess instead of `pytest.main(opts)` since the
    # `scrappyr` imports in this file execute before test execution and
    # so reports of coverage display imported code as un-covered.
    cmd = ['py.test'] + opts
    with temp_working_directory(PROJECT_ROOT):
        run_command(cmd)


@manager.command
def js_test_server():
    """Run Javascript test server.

    Unlike the backend tests, this runs a server that reruns tests when files
    are edited.
    """
    with temp_working_directory(STATIC_ROOT):
        run_subprocess([KARMA_EXEC, 'start', KARMA_CONFIG],
                       exit_message="\nQuitting JS test server...")


@manager.command
def webpack_dev_server():
    """Run webpack dev server to sync app bundle."""
    with temp_working_directory(STATIC_ROOT):
        run_subprocess([WEBPACK_DEV_SERVER_EXEC, '--hot', '--inline'],
                       exit_message="\nQuitting webpack dev server...")


def run_command(args_list):
    proc = subprocess.Popen(args_list)
    proc.communicate()


def run_subprocess(args_list, exit_message="\nQuitting..."):
    try:
        run_command(args_list)
    except KeyboardInterrupt:
        print(exit_message)


@contextmanager
def temp_working_directory(path):
    original_dir = os.path.abspath(os.path.curdir)
    os.chdir(path);
    try:
        yield
    finally:
        os.chdir(original_dir)


if __name__ == '__main__':
    manager.run()
