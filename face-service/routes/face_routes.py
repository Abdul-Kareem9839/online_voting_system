from flask import Blueprint, jsonify, request

from services.face_service import register_face_embeddings, verify_face_image

blueprint = Blueprint("face", __name__)


@blueprint.route("/register-face", methods=["POST"])
def register_face():
    try:
        data = request.get_json(silent=True) or {}
        images = data.get("images", [])

        result = register_face_embeddings(images)
        return jsonify(result)

    except ValueError as exc:
        return jsonify({
            "success": False,
            "message": str(exc)
        }), 400

    except Exception as exc:
        return jsonify({
            "success": False,
            "message": str(exc)
        }), 500


@blueprint.route("/verify-face", methods=["POST"])
def verify_face():
    try:
        data = request.get_json(silent=True) or {}
        image = data.get("image")
        stored_embeddings = data.get("stored_embeddings")

        result = verify_face_image(image, stored_embeddings)

        if result.get("verified"):
            return jsonify(result)

        return jsonify(result), 401

    except ValueError as exc:
        return jsonify({
            "success": False,
            "message": str(exc)
        }), 400

    except Exception as exc:
        return jsonify({
            "success": False,
            "message": str(exc)
        }), 500


@blueprint.route("/health", methods=["GET"])
def health():
    return jsonify({
        "success": True,
        "message": "Face Service Running"
    })
