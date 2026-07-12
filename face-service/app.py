from flask import Flask

from routes.face_routes import blueprint as face_blueprint


def create_app():
    app = Flask(__name__)
    app.register_blueprint(face_blueprint)
    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True
    )