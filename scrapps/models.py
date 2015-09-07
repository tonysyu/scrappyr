from .extensions import db


class Scrap(db.Model):

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return dict(id=self.id, title=self.title)
