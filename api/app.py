from os import environ
from flask import Flask, url_for, jsonify, request

def create_app():
    app = Flask(__name__)

    app.secret_key = 'super-not-secret'

    from .core import db
    db.init_app(app)

    from .core import oauth
    oauth.init_app(app)
    github = oauth.register(
        name='github',
        client_id=app.config.get('GITHUB_CLIENT_ID') or environ.get('GITHUB_CLIENT_ID'),
        client_secret=app.config.get('GITHUB_CLIENT_SECRET') or environ.get('GITHUB_CLIENT_SECRET'),
        api_base_url='https://api.github.com/',
        access_token_url='https://github.com/login/oauth/access_token',
        authorize_url='https://github.com/login/oauth/authorize',
        client_kwargs={'scope': 'user:email'},
    )

    @app.route('/v1/auth/login')
    def get_login_url():
        #redirect_uri = url_for('authorize', _external=True)
        redirect_uri = 'http://127.0.0.1:3000/auth/github/callback'
        res = oauth.github.authorize_redirect(redirect_uri)
        return jsonify({
            'url': res.headers['location']
        })

    @app.route('/v1/auth/code')
    def exchange_code():
        token = github.authorize_access_token()
        profile = github.get('/user')
        return jsonify({
            'token': dict(token),
            'user': profile.json(),
        })

    @app.route('/v1/users')
    def get_user():
        return jsonify({"name": "xxx"})

    return app
