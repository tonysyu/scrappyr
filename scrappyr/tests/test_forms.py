from flask.ext.testing import TestCase

from ..app import create_app
from ..forms import ScrapForm


TAG = 'dummy-tag-for-testing'
TITLE = 'Dummy title for testing'


class TestScrapForm(TestCase):

    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    TESTING = True

    def create_app(self):
        return create_app(self)

    def test_basic(self):
        data = {'title': TITLE, 'tags': [{'text': TAG}]}
        form = ScrapForm(data=data)
        assert form.data == data
        assert form.validate()

    def test_bad_title(self):
        form = ScrapForm(data={'title': {}})
        assert not form.validate()

    def test_bad_tag(self):
        form = ScrapForm(data={'title': TITLE, 'tags': [{'bad-key': 'tag'}]})
        assert not form.validate()

    def test_multiple_tags(self):
        tags = [{'text': TAG}, {'text': 'Another-tag'}]
        form = ScrapForm(data={'title': TITLE, 'tags': tags})
        assert form.data['tags'] == tags
        assert form.validate()
