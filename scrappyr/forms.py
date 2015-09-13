from flask_wtf import Form

from wtforms import FieldList, FormField, StringField
from wtforms.validators import DataRequired


class APIForm(Form):

    def __init__(self, *args, **kwargs):
        default_kwargs = {"formdata": None, "csrf_enabled": False}
        default_kwargs.update(kwargs)
        super().__init__(*args, **default_kwargs)


class TagForm(APIForm):
    text = StringField('Text', validators=[DataRequired()])


class ScrapForm(APIForm):
    title = StringField('Title', validators=[DataRequired()])
    tags = FieldList(FormField(TagForm))