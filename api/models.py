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

class Timer(db.Model):
    id = db.Column(db.Integer, nullable=False, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    started_at = db.Column(db.Integer, nullable=False)
    ended_at = db.Column(db.Integer, nullable=False)
    type = db.Column(db.SmallInteger, nullable=False, default=0) # 0: tomato, 1: coffee
    aborted = db.Column(db.Boolean, nullable=False, default=0) # 0: complete, 1: abort
    created_at = db.Column(db.Integer, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.Integer, nullable=False, default=datetime.utcnow)
    deleted_at = db.Column(db.Integer, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'started_at': self.started_at,
            'ended_at': self.ended_at,
        }

class Task(db.Model):
    id = db.Column(db.Integer, nullable=False, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    completed = db.Column(db.Boolean, nullable=False, default=0) # 0: todo, 1: done
    text = db.Column(db.String(1024), nullable=False, default='')
    completed_at = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.Integer, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.Integer, nullable=False, default=datetime.utcnow)
    deleted_at = db.Column(db.Integer, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'completed_at': self.completed_at,
            'completed': self.completed,
            'text': self.text,
        }
