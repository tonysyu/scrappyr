from ..models import Scrap


TITLE = 'Dummy title for testing'


def test_scrap_init():
    tags = ['interesting', 'useful']
    scrap = Scrap(title=TITLE, tag_labels=tags)
    assert scrap.title == TITLE
    assert set(scrap.tag_labels) == set(tags)


def test_scrap_append_tag():
    scrap = Scrap(title=TITLE)
    assert len(scrap.tag_labels) == 0

    scrap.tag_labels.append('my-tag')
    assert scrap.tag_labels == ['my-tag']
