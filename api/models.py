from datetime import datetime

from .core import db

class User(db.Model):
    id = db.Column(db.Integer, nullable=False, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    profile = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.Integer, default=datetime.utcnow)

class UserToken(db.Model):
    id = db.Column(db.Integer, nullable=False, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    token = db.Column(db.String(48), nullable=False)
    created_at = db.Column(db.Integer, default=datetime.utcnow)

class Pomodoro(db.Model):
    id = db.Column(db.Integer, nullable=False, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    started_at = db.Column(db.Integer, nullable=False)
    ended_at = db.Column(db.Integer, nullable=False)
    aborted = db.Column(db.Boolean, nullable=False, default=0)
    created_at = db.Column(db.Integer, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.Integer, nullable=False, default=datetime.utcnow)
    deleted_at = db.Column(db.Integer, nullable=True)

class Task(db.Model):
    id = db.Column(db.Integer, nullable=False, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(1024), nullable=False, default='')
    completed = db.Column(db.Boolean, nullable=False, default=0)
    description = db.Column(db.Text)
    created_at = db.Column(db.Integer, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.Integer, nullable=False, default=datetime.utcnow)
    deleted_at = db.Column(db.Integer, nullable=True)
