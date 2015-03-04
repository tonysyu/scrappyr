"""Add your views here.

We have started you with an initial blueprint. Add more as needed.
"""

from flask import Blueprint, jsonify, request
from .models import Todo
from .forms import TodoForm
from .extensions import db

todomvc = Blueprint("todomvc", __name__, static_folder="./static")

@todomvc.route("/")
def index():
    return todomvc.send_static_file("index.html")

@todomvc.route("/api")
def api():
    return ""

@todomvc.route("/api/todos", methods=["GET"])
def todos():
    todos = [todo.to_dict() for todo in Todo.query.all()]
    return jsonify(todos=todos)

@todomvc.route("/api/todos", methods=["POST"])
def add_todo():
    todo_data = request.get_json()
    form = TodoForm(data=todo_data)
    if form.validate():
        todo = Todo(**form.data)
        db.session.add(todo)
        db.session.commit()
        return jsonify(todo.to_dict())
    else:
        resp = jsonify(form.errors)
        resp.status_code = 400
        return resp

@todomvc.route("/api/todos/<int:id>", methods=["PUT"])
def update_todo(id):
    todo = Todo.query.get_or_404(id)
    todo_data = request.get_json()
    form = TodoForm(data=todo_data)
    if form.validate():
        form.populate_obj(todo)
        db.session.commit()
        return jsonify(todo.to_dict())
    else:
        resp = jsonify(form.errors)
        resp.status_code = 400
        return resp

@todomvc.route("/api/todos/<int:id>", methods=["DELETE"])
def delete_todo(id):
    todo = Todo.query.get_or_404(id)
    db.session.delete(todo)
    db.session.commit()
    return jsonify({"deleted": "true"})










