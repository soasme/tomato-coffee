# Tomato Coffee

Tomato Coffee is a Pomodoro + GTD tool.

Init json server:

```
./node_modules/.bin/json-server --watch mock/db.json --routes mock/routes.json --port 5000 --middlewares mock/auth.js
```

Or, init python server:

```
python3 -mvenv venv
source venv/bin/activate
pip install -r requirements.txt
vi .env
flask run
```

To start the dashboard,

```
yarn start
```

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

To test the dashboard,

```
yarn test
```

To build the dashboard,

```
yarn run build
```

To execute in Heroku:

```
$ heroku run -a tomato-coffee bash
~ $ python
Python 3.6.7 (default, Jan 14 2019, 21:09:08)
[GCC 7.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> from app import app
>>> from api.core import db
>>> with app.app_context():
...     db.create_all()
```
