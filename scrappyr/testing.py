from .common import db


def count_rows(model):
    """Return the number of table rows for a given model.
    """
    return len(db.session.query(model).all())
