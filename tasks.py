"""
Project management tasks run using invoke (http://www.pyinvoke.org/).
"""
import os
import subprocess
import webbrowser
from contextlib import contextmanager

import invoke
import pytest
from flask.ext.script import Server


PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
JS_TEST_ROOT = os.path.join(PROJECT_ROOT, 'scrappyr', 'static', 'test')
KARMA_EXEC = os.path.join(JS_TEST_ROOT, 'node_modules',
                          'karma-cli', 'bin', 'karma')
KARMA_CONFIG = os.path.join(JS_TEST_ROOT, 'config', 'karma.conf.js')


@invoke.task
def run():
    """Run application in browser."""
    webbrowser.open('http://127.0.0.1:5000/')
    with temp_working_directory(PROJECT_ROOT):
        run_subprocess(['python', 'manage.py', 'server'],
                       exit_message="\nQuitting scrappyr...")


@invoke.task(help={'coverage': "Display test-coverage summary"})
def tests(coverage=False):
    """Run python test suite.

    If you want to run individual tests, run py.test directly. If you want to
    debug a test, turn off output capture with `-s`:

        py.test -s path/to/test.py::TestClass::test_method
    """
    opts = ['.']
    if coverage:
        opts.extend(['--cov', 'scrappyr',  '--cov-report', 'term-missing'])
    with temp_working_directory(PROJECT_ROOT):
        pytest.main(opts)


@invoke.task
def js_test_server():
    """Run Javascript test server.

    Unlike the backend tests, this runs a server that reruns tests when files
    are edited.
    """
    with temp_working_directory(JS_TEST_ROOT):
        run_subprocess([KARMA_EXEC, 'start', KARMA_CONFIG],
                       exit_message="\nQuitting JS test server...")


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
