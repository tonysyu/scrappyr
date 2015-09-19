"""
WTForms used for validating input data.

The use of WTForms might be overkill since we're not actually receiving form
data or creating forms using it.
"""
from flask_wtf import Form
from wtforms import FieldList, FormField, StringField
from wtforms.validators import DataRequired

from .common import db
from .models import Tag


class APIForm(Form):

    def __init__(self, *args, **kwargs):
        default_kwargs = {"formdata": None, "csrf_enabled": False}
        default_kwargs.update(kwargs)
        super().__init__(*args, **default_kwargs)


class TagForm(APIForm):
    text = StringField('Text', validators=[DataRequired()])


class TagList(FieldList):

    def __init__(self, *args, **kwargs):
        super().__init__(FormField(TagForm), *args, **kwargs)

    def populate_obj(self, obj, name):
        """Update object attributes based on data in form.

        The default method cannot add or remove items from the list, only
        update existing entries. This extends the parent implementation
        to add and remove tags as needed.
        """
        data_list = getattr(obj, name)
        while len(data_list) < len(self.entries):
            newModel = Tag('__placeholder_text__')
            db.session.add(newModel)
            data_list.append(newModel)
        while len(data_list) > len(self.entries):
            db.session.delete(data_list.pop())
        super().populate_obj(obj, name)


class ScrapForm(APIForm):
    title = StringField('Title', validators=[DataRequired()])
    tags = TagList()
