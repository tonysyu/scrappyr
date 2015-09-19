from sqlalchemy.ext.associationproxy import association_proxy

from .common import db


scrap_tag = db.Table(
    'scrap_tag',
    db.metadata,
    db.Column('scrap_id', db.Integer,
              db.ForeignKey('scrap.id'), nullable=False),
    db.Column('tag_id', db.Integer,
              db.ForeignKey('tag.id'), nullable=False),
)


def tags_from_dicts(tag_list):
    """Return a list of Tag objects from a list of dicts with tag data."""
    return [Tag.from_dict(data) for data in tag_list]


class Scrap(db.Model):

    __tablename__ = 'scrap'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)

    tags = db.relationship('Tag', secondary=scrap_tag, backref='Scrap')
    tag_labels = association_proxy('tags', 'text')

    def to_dict(self):
        tags = [t.to_dict() for t in self.tags]
        return dict(id=self.id, title=self.title, tags=tags)

    @classmethod
    def from_dict(cls, data):
        tags = tags_from_dicts(data['tags'])
        return cls(title=data['title'], tags=tags)


class Tag(db.Model):

    __tablename__ = 'tag'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    text = db.Column(db.String(30), nullable=False)

    def __init__(self, text):
        self.text = text

    def to_dict(self):
        return {'text': self.text}

    @classmethod
    def from_dict(cls, data):
        return cls(text=data['text'])
