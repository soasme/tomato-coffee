import json
from os import environ
from flask import Flask, url_for, jsonify, request

def create_app():
    app = Flask(__name__)

    app.config.update(**{
        'SECRET_KEY': environ.get('SECRET_KEY') or 'xxxx',
        'SQLALCHEMY_DATABASE_URI': environ.get('SQLALCHEMY_DATABASE_URI'),
        'GITHUB_CLIENT_ID': environ.get('GITHUB_CLIENT_ID'),
        'GITHUB_CLIENT_SECRET': environ.get('GITHUB_CLIENT_SECRET'),
    })

    from .core import db
    db.init_app(app)

    from .core import oauth
    oauth.init_app(app)
    github = oauth.register(
        name='github',
        client_id=app.config.get('GITHUB_CLIENT_ID'),
        client_secret=app.config.get('GITHUB_CLIENT_SECRET'),
        api_base_url='https://api.github.com/',
        access_token_url='https://github.com/login/oauth/access_token',
        authorize_url='https://github.com/login/oauth/authorize',
        client_kwargs={'scope': 'user:email'},
    )

    from .models import User, UserToken

    @app.route('/v1/auth/login')
    def get_login_url():
        redirect_uri = 'http://127.0.0.1:3000/auth/github/callback'
        res = oauth.github.authorize_redirect(redirect_uri)
        return jsonify({
            'url': res.headers['location']
        })

    @app.route('/v1/auth/code')
    def exchange_code():
        token = github.authorize_access_token()
        profile = github.get('/user').json()

        user = User.query.filter(User.name==profile['login']).first()
        if not user:
            user = User(name=profile['login'], profile=json.dumps(profile))
            db.session.add(user)
            db.session.commit()

        userToken = UserToken(user_id=user.id, token=token['access_token'])
        db.session.add(userToken)
        db.session.commit()

        return jsonify({
            'token': dict(token),
            'user': profile,
        })

    @app.route('/v1/users')
    def get_user():
        token = request.args.get('token') or \
                request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'error': 'no token'}), 400

        user_token = UserToken.query.filter(UserToken.token==token).first()
        if not user_token:
            return jsonify({'error': 'invalid token'}), 400

        user = User.query.get(user_token.user_id)
        return jsonify({"name": user.name, "profile": json.loads(user.profile)})

    @app.route('/admin/migrate')
    def admin_migrate():
        db.create_all()
        return jsonify({'msg': 'ok'})

    from . import views

    app.add_url_rule('/v1/timers', view_func=views.get_timers)
    app.add_url_rule('/v1/timers', methods=['POST'], view_func=views.add_timer)
    app.add_url_rule('/v1/tasks', view_func=views.get_tasks)
    app.add_url_rule('/v1/tasks', methods=['POST'], view_func=views.add_task)
    app.add_url_rule('/v1/tasks/<int:id>', methods=['PATCH'], view_func=views.update_task)

    return app
