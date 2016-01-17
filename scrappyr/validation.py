from schematics.exceptions import ModelConversionError, ModelValidationError
from schematics.models import Model
from schematics.types import IntType, StringType
from schematics.types.compound import ListType, ModelType


class BaseModel(Model):

    def validation_errors(self):
        """Return error message raised by `validate` method.

        If the model is valid, then return None.
        """
        try:
            self.validate()
        except ModelValidationError as error:
            return error.messages
        else:
            return None


class TagForm(BaseModel):
    id = IntType()
    text = StringType(required=True)


class ScrapForm(BaseModel):
    id = IntType()
    title = StringType(required=True)
    html_title = StringType()
    tags = ListType(ModelType(TagForm))
