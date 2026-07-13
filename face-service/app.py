import os

try:
    from dotenv import load_dotenv
except ImportError:
    def load_dotenv():
        return False

from flask import Flask

from routes.face_routes import blueprint as face_blueprint


load_dotenv()


def create_app():
    app = Flask(__name__)
    app.register_blueprint(face_blueprint)
    return app


app = create_app()


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5001"))
    debug = os.getenv("FLASK_ENV", "development").lower() == "development"

    if debug:
        import logging
        logging.basicConfig(level=logging.DEBUG)

    app.run(
        host="0.0.0.0",
        port=port,
        debug=debug,
    )