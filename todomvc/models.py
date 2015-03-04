from .extensions import db

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    completed = db.Column(db.Boolean, nullable=False, default=False)

    def to_dict(self):
        return dict(id=self.id, title=self.title, completed=self.completed)