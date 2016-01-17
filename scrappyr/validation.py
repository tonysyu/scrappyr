from schematics.exceptions import ModelConversionError, ModelValidationError
from schematics.models import Model
from schematics.types import IntType, StringType
from schematics.types.compound import ListType, ModelType


class BaseScrappyrError(Exception):

    DEFAULT_STATUS_CODE = 400

    def __init__(self, message, status_code=None, data=None):
        self.message = message
        self.status_code = status_code or self.DEFAULT_STATUS_CODE
        self.data = data

    def to_dict(self):
        data = dict(self.data or ())
        data['error_message'] = self.message
        return data


class FormCreationError(BaseScrappyrError):

    pass


class FormValidationError(BaseScrappyrError):

    pass


class BaseModel(Model):
    """Base schematics model for scrappyr forms.

    Override errors to return derivatives of BaseScrappyrError.
    """

    def __init__(self, *args, **kwargs):
        try:
            super().__init__(*args, **kwargs)
        except ModelConversionError as error:
            raise FormCreationError(error.messages)
        except ValueError as error:
            raise FormCreationError(error.args[0])

    def validate(self):
        """Override to return BaseScrappyrError

        If the model is valid, then return None.
        """
        try:
            super().validate()
        except ModelValidationError as error:
            raise FormValidationError(error.messages)
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
