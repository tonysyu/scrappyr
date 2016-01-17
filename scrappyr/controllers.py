"""Route controllers for the app.

"""

import markdown

from flask import Blueprint, jsonify, request
from schematics.exceptions import ModelConversionError
from .common import db
from .models import Scrap, Tag
from .validation import ScrapForm


scrappyr = Blueprint('scrappyr', __name__, static_folder='./static')


@scrappyr.route('/')
def index():
    return scrappyr.send_static_file('index.html')


@scrappyr.route('/api')
def api():
    return ''


@scrappyr.route('/api/tags', methods=['GET'])
def get_all_tags():
    # TODO: Set tag.id as the key!!!
    tags = [tag.to_dict() for tag in Tag.query.all()]
    return jsonify(tags=tags)


@scrappyr.route('/api/tags/<int:id>', methods=['DELETE'])
def delete_tag(id):
    tag = Tag.query.get_or_404(id)
    db.session.delete(tag)
    db.session.commit()
    return jsonify({'deleted': 'true'})


@scrappyr.route('/api/scraps', methods=['GET'])
def get_all_scraps():
    scraps = [render_data(scrap) for scrap in Scrap.query.all()]
    return jsonify(scraps=scraps)


@scrappyr.route('/api/scraps', methods=['POST'])
def add_scrap():
    scrap_data = request.get_json()
    try:
        form = ScrapForm(scrap_data)
    except ModelConversionError as error:
        return _jsonify_errors({'error': error.messages})
    error_message = form.validation_errors()
    if error_message:
        return _jsonify_errors(error_message)
    else:
        scrap = Scrap.from_dict(form.to_primitive())
        db.session.add(scrap)
        db.session.commit()
        return jsonify(render_data(scrap))


@scrappyr.route('/api/scraps/<int:id>', methods=['PUT'])
def update_scrap(id):
    scrap = Scrap.query.get_or_404(id)
    scrap_data = request.get_json()
    try:
        form = ScrapForm(scrap_data)
    except ValueError as error:
        return _jsonify_errors({'error': error.args[0]})
    error_message = form.validation_errors()
    if error_message:
        return _jsonify_errors(error_message)
    else:
        scrap.update_from(form.to_primitive())
        db.session.commit()
        return jsonify(render_data(scrap))


@scrappyr.route('/api/scraps/<int:id>', methods=['DELETE'])
def delete_scrap(id):
    scrap = Scrap.query.get_or_404(id)
    db.session.delete(scrap)
    db.session.commit()
    return jsonify({'deleted': 'true'})


def render_data(scrap):
    data = scrap.to_dict()
    data['html_title'] = markdown.markdown('#' + data['title'])
    return data


def _jsonify_errors(errors):
    resp = jsonify(errors)
    resp.status_code = 400
    return resp
