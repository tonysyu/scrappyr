"""Add your views here.

We have started you with an initial blueprint. Add more as needed.
"""

import markdown

from flask import Blueprint, jsonify, request
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


@scrappyr.route('/api/scraps', methods=['GET'])
def get_all_scraps():
    scraps = [render_data(scrap) for scrap in Scrap.query.all()]
    return jsonify(scraps=scraps)


@scrappyr.route('/api/scraps', methods=['POST'])
def add_scrap():
    scrap_data = request.get_json()
    form = ScrapForm(scrap_data)
    error_message = form.validation_errors()
    if error_message:
        return _jsonify_errors(form.errors)
    else:
        scrap = Scrap.from_dict(form.to_primitive())
        db.session.add(scrap)
        db.session.commit()
        return jsonify(render_data(scrap))


@scrappyr.route('/api/scraps/<int:id>', methods=['PUT'])
def update_scrap(id):
    scrap = Scrap.query.get_or_404(id)
    scrap_data = request.get_json()
    form = ScrapForm(scrap_data)
    error_message = form.validation_errors()
    if error_message:
        return _jsonify_errors(form.errors)
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
