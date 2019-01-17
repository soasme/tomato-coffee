from time import time
from flask import request, jsonify

from .models import User, UserToken, Timer, Task
from .core import db

def get_user():
    token = request.args.get('token') or \
            request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        raise Exception('no token')

    user_token = UserToken.query.filter(UserToken.token==token).first()
    if not user_token:
        raise Exception('invalid token')

    return User.query.get(user_token.user_id)

def get_timers():
    ended_at_gte = request.args.get('ended_at_gte', type=int, default=int(time()) - 7*3600)
    ended_at_lte = request.args.get('ended_at_lte', type=int, default=int(time()))
    try:
        user = get_user()
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    timers = Timer.query.filter(
        Timer.user_id==user.id,
        Timer.ended_at <= ended_at_lte,
        Timer.ended_at >= ended_at_gte,
    )
    return jsonify([timer.to_dict() for timer in timers])

def add_timer():
    try:
        user = get_user()
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    data = request.get_json()
    timer = Timer(
        user_id=user.id,
        started_at=data['started_at'],
        ended_at=data['ended_at'],
    )
    db.session.add(timer)
    db.session.commit()
    return '', 201

def delete_timer(id):
    try:
        user = get_user()
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    timer = Timer.query.get(id)
    if timer.user_id != user.id:
        return jsonify({'error': 'not found'}), 404
    db.session.delete(timer)
    db.session.commit()
    return '', 200

def get_tasks():
    completed_at_gte = request.args.get('completed_at_gte', type=int, default=int(time()) - 7*3600)
    completed_at_lte = request.args.get('completed_at_lte', type=int, default=int(time()))
    completed = request.args.get('completed')
    try:
        user = get_user()
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    if completed == 'false':
        tasks = Task.query.filter(
            Task.user_id==user.id,
            Task.completed==False,
        )
    else:
        tasks = Task.query.filter(
            Task.user_id==user.id,
            Task.completed==True,
            Task.completed_at<=completed_at_lte,
            Task.completed_at>=completed_at_gte,
        )
    return jsonify([tasks.to_dict() for tasks in tasks])

def add_task():
    try:
        user = get_user()
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    data = request.get_json()
    task = Task(
        user_id=user.id,
        text=data['text'],
        completed=0,
    )
    db.session.add(task)
    db.session.commit()
    return '', 201

def update_task(id):
    try:
        user = get_user()
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    data = request.get_json()
    task = Task.query.get(id)
    if 'text' in data:
        task.text = text
    if 'completed' in data:
        task.completed = bool(completed)
    db.session.add(task)
    db.session.commit()
    return '', 200

def delete_task(id):
    try:
        user = get_user()
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    task = Task.query.get(id)
    if task.user_id != user.id:
        return jsonify({'error': 'not found'}), 404
    db.session.delete(task)
    db.session.commit()
    return '', 200
