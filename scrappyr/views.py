"""Add your views here.

We have started you with an initial blueprint. Add more as needed.
"""

import markdown

from flask import Blueprint, jsonify, request
from .common import db
from .models import Scrap
from .forms import ScrapForm


scrappyr = Blueprint('scrappyr', __name__, static_folder='./static')


@scrappyr.route('/')
def index():
    return scrappyr.send_static_file('index.html')


@scrappyr.route('/api')
def api():
    return ''


@scrappyr.route('/api/scraps', methods=['GET'])
def get_all_scraps():
    scraps = {scrap.id: render_data(scrap) for scrap in Scrap.query.all()}
    return jsonify(scraps=scraps)


@scrappyr.route('/api/scraps', methods=['POST'])
def add_scrap():
    scrap_data = request.get_json()
    form = ScrapForm(data=scrap_data)
    if form.validate():
        scrap = Scrap.from_dict(form.data)
        db.session.add(scrap)
        db.session.commit()
        return jsonify(render_data(scrap))
    else:
        return _jsonify_errors(form.errors)


@scrappyr.route('/api/scraps/<int:id>', methods=['PUT'])
def update_scrap(id):
    scrap = Scrap.query.get_or_404(id)
    scrap_data = request.get_json()
    form = ScrapForm(data=scrap_data)
    if form.validate():
        form.populate_obj(scrap)
        db.session.commit()
        return jsonify(render_data(scrap))
    else:
        return _jsonify_errors(form.errors)


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
