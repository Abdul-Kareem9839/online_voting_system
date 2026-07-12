import time

from scipy.spatial.distance import cosine

THRESHOLD = 0.70


def _load_deepface():
    try:
        from deepface import DeepFace
    except ModuleNotFoundError as exc:
        raise RuntimeError(
            "deepface is not installed. Install the dependencies from requirements.txt first."
        ) from exc
    return DeepFace


def register_face_embeddings(images):
    if not images:
        raise ValueError("No data received")

    if len(images) < 3:
        raise ValueError("Minimum 3 images required")

    DeepFace = _load_deepface()
    embeddings = []

    for index, img in enumerate(images):
        try:
            start = time.time()
            result = DeepFace.represent(
                img_path=img,
                model_name="Facenet512",
                detector_backend="opencv",
                enforce_detection=False
            )
            embeddings.append(result[0]["embedding"])
            print(f"Image {index + 1} processed in {time.time() - start:.2f} sec")
        except Exception as exc:
            print(f"Error processing image {index + 1}: {exc}")
            continue

    if len(embeddings) == 0:
        raise ValueError("Could not generate embeddings")

    return {
        "success": True,
        "embeddings": embeddings,
        "total_embeddings": len(embeddings)
    }


def verify_face_image(image, stored_embeddings):
    if not image:
        raise ValueError("Image required")

    if not stored_embeddings:
        raise ValueError("Stored embeddings required")

    DeepFace = _load_deepface()
    result = DeepFace.represent(
        img_path=image,
        model_name="Facenet512",
        detector_backend="opencv",
        enforce_detection=False
    )
    current_embedding = result[0]["embedding"]

    similarities = []
    for emb in stored_embeddings:
        similarity = 1 - cosine(current_embedding, emb)
        similarities.append(similarity)

    best_similarity = max(similarities)
    print(f"Best Similarity: {best_similarity:.4f}")
    print(f"Threshold: {THRESHOLD}")

    if best_similarity >= THRESHOLD:
        return {
            "success": True,
            "verified": True,
            "similarity": float(best_similarity)
        }

    return {
        "success": False,
        "verified": False,
        "similarity": float(best_similarity),
        "message": "Face verification failed"
    }
