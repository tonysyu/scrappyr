import json
from flask.ext.testing import TestCase

from ..app import create_app
from ..common import db
from ..models import Scrap, Tag
from ..testing import count_rows, strip_ids


TAG = 'dummy-tag-for-testing'
TITLE = 'Dummy title for testing'
TAG_DATA_LIST = [{'text': TAG}]


def add_to_db(obj):
    db.session.add(obj)
    db.session.commit()


def drop_ids(sequence):
    sequence = sequence[:]  # Modify copy of sequence instead of original.
    for obj in sequence:
        del obj['id']
    return sequence


class TestHarness(TestCase):

    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    TESTING = True

    def create_app(self):
        return create_app(self)


class TestBasic(TestHarness):

    def test_index(self):
        response = self.client.get('/')
        assert response.status_code == 200

    def test_api(self):
        response = self.client.get('/api')
        assert response.status_code == 200

    def post_scrap(self, data):
        return self.client.post('/api/scraps', data=json.dumps(data),
                                content_type='application/json')

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

    def test_get_all_tags(self):
        data = {'title': TITLE, 'tags': TAG_DATA_LIST}
        response = self.post_scrap(data)
        response = self.client.get('/api/tags')
        assert response.status_code == 200
        tags = drop_ids(response.json['tags'])
        assert tags == TAG_DATA_LIST

    def test_post(self):
        data = {'title': TITLE, 'tags': TAG_DATA_LIST}
        response = self.post_scrap(data)
        assert response.status_code == 200
        scrap = response.json
        assert scrap['title'] == TITLE
        assert strip_ids(scrap['tags']) == TAG_DATA_LIST
        assert TITLE in scrap['html_title']

    def test_post_scrap_with_bad_tag(self):
        bad_tags = [{'bad-key': 'tag-label'}]
        response = self.post_scrap({'title': TITLE, 'tags': bad_tags})
        assert response.status_code == 400

    def test_post_scrap_with_no_title(self):
        response = self.post_scrap({})  # title is required
        assert response.status_code == 400

    def test_delete(self):
        add_to_db(Scrap(title=TITLE))
        assert count_rows(Scrap) == 1
        response = self.client.delete('/api/scraps/1')
        assert response.status_code == 200
        assert count_rows(Scrap) == 0

    def test_delete_tag(self):
        data = {'title': TITLE, 'tags':  TAG_DATA_LIST}
        scrap = Scrap.from_dict(data)
        add_to_db(scrap)
        assert count_rows(Tag) == 1
        assert len(scrap.tags) == 1

        response = self.client.delete('/api/tags/1')
        assert response.status_code == 200
        assert count_rows(Tag) == 0
        assert len(scrap.tags) == 0


class TestPut(TestHarness):

    def test_put_new_title(self):
        data = {'title': 'Original title', 'tags':  TAG_DATA_LIST}
        add_to_db(Scrap.from_dict(data))
        data['title'] = TITLE

        response = self.put(data)
        assert response.status_code == 200

        assert response.json['title'] == TITLE
        # Tags and Tag table should remain unchanged:
        assert strip_ids(response.json['tags']) == TAG_DATA_LIST
        assert count_rows(Tag) == 1

    def test_put_new_tag(self):
        data = {'title': TITLE, 'tags':  TAG_DATA_LIST}
        add_to_db(Scrap.from_dict(data))
        data['tags'] = [{'text': 'new'}]

        response = self.put(data)
        assert response.status_code == 200

        assert strip_ids(response.json['tags']) == data['tags']
        # Updating a scrap's tag shouldn't overwrite the original:
        assert count_rows(Tag) == 2
        # Title and size of Scrap table should be unchanged:
        assert response.json['title'] == TITLE
        assert count_rows(Scrap) == 1

    def test_put_all_properties(self):
        self.add_minimal_scrap()
        # Update with all properties
        data = {'id': 1, 'title': TITLE, 'tags': TAG_DATA_LIST,
                'html_title': '<h1>{}</h1>'.format(TITLE)}
        response = self.put(data)
        assert response.status_code == 200
        output = dict(response.json)
        output['tags'] = strip_ids(output['tags'])
        assert output == data

    def test_put_bad_tag(self):
        self.add_minimal_scrap()
        data = {'id': 1, 'title': TITLE, 'tags': {'bad-key': 'value'}}
        response = self.put(data)
        assert response.status_code == 400

    def test_put_scrap_with_no_title(self):
        self.add_minimal_scrap()
        response = self.put({'id': 1})
        assert response.status_code == 400

    def put(self, data, scrap_id=1):
        url = '/api/scraps/{}'.format(scrap_id)
        return self.client.put(url, data=json.dumps(data),
                               content_type='application/json')

    def add_minimal_scrap(self):
        add_to_db(Scrap(title=TITLE))
