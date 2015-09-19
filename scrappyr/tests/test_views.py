import json
from flask.ext.testing import TestCase

from ..app import create_app
from ..common import db
from ..models import Scrap


TAG = 'dummy-tag-for-testing'
TITLE = 'Dummy title for testing'


def add_to_db(obj):
    db.session.add(obj)
    db.session.commit()


def count_scraps():
    return len(list(db.session.query(Scrap)))


class TestView(TestCase):

    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    TESTING = True

    def create_app(self):
        return create_app(self)

    def setup(self):
        db.create_all()
        self.client = self.app.test_client()

    def teardown(self):
        db.session.remove()
        db.drop_all()

    def test_get_from_empty_db(self):
        response = self.client.get('/api/scraps')
        assert response.status_code == 200
        assert response.json['scraps'] == []

    def test_get(self):
        add_to_db(Scrap(title=TITLE))
        response = self.client.get('/api/scraps')
        assert response.status_code == 200
        assert len(response.json['scraps']) == 1

        scrap = response.json['scraps'][0]
        assert scrap['title'] == TITLE
        assert scrap['tags'] == []
        assert TITLE in scrap['html_title']

    def test_post(self):
        data = {'title': TITLE}
        response = self.client.post('/api/scraps', data=json.dumps(data),
                                    content_type='application/json')
        assert response.status_code == 200
        scrap = response.json
        assert scrap['title'] == TITLE
        assert scrap['tags'] == []
        assert TITLE in scrap['html_title']

    def test_put(self):
        add_to_db(Scrap(title='Original title'))
        data = {'title': TITLE}
        response = self.client.put('/api/scraps/1', data=json.dumps(data),
                                   content_type='application/json')
        assert response.status_code == 200
        scrap = response.json
        assert scrap['title'] == TITLE
        assert TITLE in scrap['html_title']

    def test_delete(self):
        add_to_db(Scrap(title=TITLE))
        assert count_scraps() == 1
        response = self.client.delete('/api/scraps/1')
        assert response.status_code == 200
        assert count_scraps() == 0
