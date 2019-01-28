import os
import sys
import pytest


@pytest.fixture
def client():
    sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
    print(sys.path)
    from api.app import create_app
    app = create_app()
    yield app.test_client()
    return app
