from sqlalchemy.ext.associationproxy import association_proxy

from .extensions import db


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
    tag_labels = association_proxy('tags', 'label')

    def to_dict(self):
        return dict(id=self.id, title=self.title, tags=self.tags)


class Tag(db.Model):

    __tablename__ = 'tag'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    label = db.Column(db.String(30), nullable=False)

    def __init__(self, label):
        self.label = label
