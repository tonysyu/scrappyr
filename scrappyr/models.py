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


class Scrap(db.Model):

    __tablename__ = 'scrap'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)

    tags = db.relationship('Tag', secondary=scrap_tag, backref='Scrap')
    tag_labels = association_proxy('tags', 'text')

    def to_dict(self):
        tags = [t.to_dict() for t in self.tags]
        return dict(id=self.id, title=self.title, tags=tags)


class Tag(db.Model):

    __tablename__ = 'tag'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    text = db.Column(db.String(30), nullable=False)

    def __init__(self, text):
        self.text = text

    def to_dict(self):
        return {'text': self.text}
