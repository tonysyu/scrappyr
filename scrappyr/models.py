from sqlalchemy.ext.associationproxy import association_proxy

from .common import db
from .utils import repr_attrs


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

    tags = db.relationship('Tag', secondary=scrap_tag)
    tag_labels = association_proxy('tags', 'text')

    def __repr__(self):
        return repr_attrs(self, ['id', 'title', 'tags'])

    def to_dict(self):
        tags = [t.to_dict() for t in self.tags]
        return dict(id=self.id, title=self.title, tags=tags)

    @classmethod
    def from_dict(cls, data):
        tags = tags_from_dicts(data['tags'])
        return cls(title=data['title'], tags=tags)

    @classmethod
    def create(cls, **data):
        return cls.from_dict(data)

    def update_from(self, data):
        if 'id' in data and data['id'] is not None:
            assert data['id'] == self.id
        self.title = data['title']
        self.tags = tags_from_dicts(data['tags'])


class Tag(db.Model):

    __tablename__ = 'tag'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    text = db.Column(db.String(30), unique=True, nullable=False)

    def __init__(self, text=None):
        self.text = text

    def __repr__(self):
        return repr_attrs(self, ['id', 'text'])

    def to_dict(self):
        return {'id': self.id, 'text': self.text}

    @classmethod
    def from_dict(cls, data):
        return cls.get_or_create(**data)

    @classmethod
    def get_or_create(cls, text, id=None):
        """Return a matching tag from the database or create it."""
        if id is not None:
            return db.session.query(cls).filter_by(id=id).first()

        instance = db.session.query(cls).filter_by(text=text).first()
        if instance:
            return instance
        else:
            return cls(text=text)
