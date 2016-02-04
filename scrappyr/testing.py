import os
import shutil
import tempfile
from contextlib import contextmanager
from copy import deepcopy

from .common import db


def count_rows(model):
    """Return the number of table rows for a given model.
    """
    return len(db.session.query(model).all())


def strip_ids(dict_list):
    """Remove id from each dictionary in a list of dictionaries.

    The ID is often added automatically, and it's convenient to strip it out
    sometimes.
    """
    new_dict_list = deepcopy(dict_list)
    for each in new_dict_list:
        del each['id']
    return new_dict_list


@contextmanager
def temp_file_path(file_name='tmp.txt'):
    """Yield a writeable temporary filename that is deleted on context exit.

    Parameters
    ----------
    suffix : string, optional
        The suffix for the file.

    """
    temp_dir = tempfile.mkdtemp()
    file_path = os.path.join(temp_dir, file_name)
    try:
        yield file_path
    finally:
        shutil.rmtree(temp_dir)
