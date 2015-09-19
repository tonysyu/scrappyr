from flask.ext.testing import TestCase

from ..app import create_app
from ..common import db
from ..models import Scrap, Tag
from ..testing import count_rows


TAG = 'dummy-tag-for-testing'
TITLE = 'Dummy title for testing'


def test_scrap_init():
    scrap = Scrap(title=TITLE, tag_labels=[TAG])
    assert scrap.title == TITLE
    assert scrap.tag_labels == [TAG]


def test_scrap_append_tag():
    scrap = Scrap(title=TITLE)
    assert len(scrap.tag_labels) == 0

    scrap.tag_labels.append(TAG)
    assert scrap.tag_labels == [TAG]


def test_scrap_with_tag_object():
    scrap = Scrap(title=TITLE, tags=[Tag(text=TAG)])
    assert len(scrap.tag_labels) == 1
    assert scrap.tag_labels == [TAG]


def test_scrap_with_two_tags():
    tags = ['a', 'b']
    scrap = Scrap(title=TITLE, tag_labels=tags)
    assert scrap.title == TITLE
    assert set(scrap.tag_labels) == set(tags)


def test_scrap_to_dict():
    scrap = Scrap(id=1, title=TITLE, tag_labels=[TAG])
    scrap_data = scrap.to_dict()
    assert scrap_data['id'] == 1
    assert scrap_data['title'] == TITLE
    assert scrap_data['tags'] == [{'text': TAG}]


class TestDatabase(TestCase):

    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    TESTING = True

    def create_app(self):
        return create_app(self)

    def setup(self):
        db.create_all()

    def teardown(self):
        db.session.remove()
        db.drop_all()

    def test_empty_scrap_table(self):
        assert count_rows(Scrap) == 0

    def test_empty_tag_table(self):
        assert count_rows(Tag) == 0

    def test_add_scrap(self):
        scrap = Scrap(title=TITLE)
        db.session.add(scrap)
        db.session.commit()

        assert count_rows(Scrap) == 1
        loaded_scrap = db.session.query(Scrap).first()
        assert loaded_scrap.title == TITLE

    def test_add_tag(self):
        db.session.add(Tag(TAG))
        db.session.commit()
        assert count_rows(Tag) == 1

    def test_add_duplicate_tag(self):
        # Add two instances of tags with the same text
        db.session.add(Tag.get_or_create(TAG))
        db.session.add(Tag.get_or_create(TAG))
        db.session.commit()
        assert count_rows(Tag) == 1

    def test_add_scrap_tag(self):
        scrap = Scrap(title=TITLE, tag_labels=[TAG])
        db.session.add(scrap)
        db.session.commit()

        loaded_scrap = db.session.query(Scrap).first()
        assert loaded_scrap.tag_labels == [TAG]

        assert count_rows(Tag) == 1
        loaded_tag = db.session.query(Tag).first()
        assert loaded_tag.text == TAG

    def test_add_two_scraps_with_the_same_tag(self):
        db.session.add(Scrap.create(title='first', tags=[{'text': TAG}]))
        db.session.add(Scrap.create(title='second', tags=[{'text': TAG}]))
        assert count_rows(Scrap) == 2
        assert count_rows(Tag) == 1
