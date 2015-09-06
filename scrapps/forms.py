from flask_wtf import Form

from wtforms import StringField, BooleanField
from wtforms.validators import DataRequired


class APIForm(Form):

    def __init__(self, *args, **kwargs):
        default_kwargs = {"formdata": None, "csrf_enabled": False}
        default_kwargs.update(kwargs)
        super().__init__(*args, **default_kwargs)


class TodoForm(APIForm):

    title = StringField('Title', validators=[DataRequired()])
    completed = BooleanField('Completed', default=False)
