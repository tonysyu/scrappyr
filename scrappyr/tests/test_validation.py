import pytest

from ..testing import strip_ids
from ..validation import FormCreationError, FormValidationError, ScrapForm


TAG = 'dummy-tag-for-testing'
TITLE = 'Dummy title for testing'
REQUIRED_FIELD_ERROR = 'This field is required.'


def test_basic():
    data = {'title': TITLE, 'tags': [{'text': TAG}]}
    form = ScrapForm(data)
    scrap = form.to_primitive()
    assert scrap['title'] == data['title']
    assert strip_ids(scrap['tags']) == data['tags']
    form.validate()


def test_no_title():
    form = ScrapForm({})
    with pytest.raises(FormValidationError):
        assert form.validate()


def test_bad_title():
    with pytest.raises(FormCreationError):
        ScrapForm({'title': {}})


def test_bad_tag():
    with pytest.raises(FormCreationError):
        ScrapForm({'title': TITLE, 'tags': [{'bad-key': 'tag'}]})


def test_multiple_tags():
    tags = [{'text': TAG}, {'text': 'Another-tag'}]
    form = ScrapForm({'title': TITLE, 'tags': tags})
    scrap = form.to_primitive()
    assert strip_ids(scrap['tags']) == tags
    form.validate()
