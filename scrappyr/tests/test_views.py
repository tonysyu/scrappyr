import json
from flask.ext.testing import TestCase

from ..app import create_app
from ..common import db
from ..models import Scrap, Tag
from ..testing import count_rows


TAG = 'dummy-tag-for-testing'
TITLE = 'Dummy title for testing'
TAG_DATA_LIST = [{'text': TAG}]


def add_to_db(obj):
    db.session.add(obj)
    db.session.commit()


def count_scraps():
    return len(db.session.query(Scrap).all())


class TestHarness(TestCase):

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


class TestBasicView(TestHarness):

    def test_get_from_empty_db(self):
        response = self.client.get('/api/scraps')
        assert response.status_code == 200
        assert response.json['scraps'] == {}

    def test_get(self):
        add_to_db(Scrap(title=TITLE))
        response = self.client.get('/api/scraps')
        assert response.status_code == 200
        assert len(response.json['scraps']) == 1

        scrap = list(response.json['scraps'].values())[0]
        assert scrap['title'] == TITLE
        assert scrap['tags'] == []
        assert TITLE in scrap['html_title']

    def test_post(self):
        data = {'title': TITLE, 'tags': TAG_DATA_LIST}
        response = self.client.post('/api/scraps', data=json.dumps(data),
                                    content_type='application/json')
        assert response.status_code == 200
        scrap = response.json
        assert scrap['title'] == TITLE
        assert scrap['tags'] == TAG_DATA_LIST
        assert TITLE in scrap['html_title']

    def test_delete(self):
        add_to_db(Scrap(title=TITLE))
        assert count_scraps() == 1
        response = self.client.delete('/api/scraps/1')
        assert response.status_code == 200
        assert count_scraps() == 0


class TestPut(TestHarness):

    def test_put_new_title(self):
        data = {'title': 'Original title', 'tags':  TAG_DATA_LIST}
        add_to_db(Scrap.from_dict(data))
        data['title'] = TITLE

        response = self.put(data)
        assert response.status_code == 200

        assert response.json['title'] == TITLE
        # Tags and Tag table should remain unchanged:
        assert response.json['tags'] == TAG_DATA_LIST
        assert count_rows(Tag) == 1

    def test_put_new_tag(self):
        data = {'title': TITLE, 'tags':  TAG_DATA_LIST}
        add_to_db(Scrap.from_dict(data))
        data['tags'] = [{'text': 'new'}]

        response = self.put(data)
        assert response.status_code == 200

        assert response.json['tags'] == data['tags']
        # Updating a scrap's tag shouldn't overwrite the original:
        assert count_rows(Tag) == 2
        # Title and size of Scrap table should be unchanged:
        assert response.json['title'] == TITLE
        assert count_rows(Scrap) == 1

    def test_put_all_properties(self):
        # Add minimal scrap
        add_to_db(Scrap(title=TITLE))
        # Update with all properties
        data = {'id': 1, 'title': TITLE, 'tags': TAG_DATA_LIST,
                'html_title': '<h1>{}</h1>'.format(TITLE)}
        response = self.put(data)
        assert response.status_code == 200
        assert response.json == data

    def put(self, data, scrap_id=1):
        url = '/api/scraps/{}'.format(scrap_id)
        return self.client.put(url, data=json.dumps(data),
                               content_type='application/json')
