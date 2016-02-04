import json
import os
from contextlib import contextmanager
from unittest import TestCase

import pytest
import sqlalchemy

from ..app import create_app
from ..common import db
from ..testing import temp_file_path


class TestCreateApp(TestCase):

    DB_URI = SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    TESTING = True

    def test_normal_initialization(self):
        app = create_app(self)
        assert app.config['SQLALCHEMY_DATABASE_URI'] == self.DB_URI
        assert app.config['TESTING'] == self.TESTING

    def test_unknown_config_file_type(self):
        with temp_file_path('config.with_bad_extension') as cfg_file:
            with pytest.raises(ValueError):
                app = create_app(self, config_file=cfg_file)


class TestCreateAppAndOverrideDBUri(TestCase):

    UNUSED_URI = SQLALCHEMY_DATABASE_URI = 'This should not be used by app'

    def setup_method(self, method):
        self.db_file = '/tmp/scrappyr_test.db'
        self.uri = 'sqlite:///{}'.format(self.db_file)

    def teardown_method(self, method):
        if os.path.exists(self.db_file):
            os.remove(self.db_file)

    def test_default_path_raises_error(self):
        with pytest.raises(sqlalchemy.exc.ArgumentError):
            create_app(self)

    def test_explicit_db_uri(self):
        app = create_app(self, db_uri=self.uri)
        assert app.config['SQLALCHEMY_DATABASE_URI'] == self.uri

    def test_cfg_file(self):
        cfg_text = "SQLALCHEMY_DATABASE_URI = {!r}".format(self.uri)
        with temp_file_path('app.cfg') as cfg_file:
            with open(cfg_file, 'w') as f:
                f.write(cfg_text)

            app = create_app(self, config_file=cfg_file)
            assert app.config['SQLALCHEMY_DATABASE_URI'] == self.uri

    def test_json_file(self):
        cfg = {'SQLALCHEMY_DATABASE_URI': self.uri}
        with temp_file_path('config.json') as json_file:
            with open(json_file, 'w') as f:
                json.dump(cfg, f)

            with pytest.raises(RuntimeError):
                app = create_app(self, config_file=json_file)
