from flask import request, jsonify, Response
from models.designers_model import Designer
from bson import ObjectId


def add_designer():
    data = request.get_json()

    required_fields = [
        "name",
        "email",
        "ratings",
        "projects",
        "phone",
        "description",
        "isShortlisted",
        "years",
        "price",
    ]

    # Check for missing fields
    if not all(field in data and data[field] is not None for field in required_fields):
        return jsonify({"error": "All fields are required."}), 400

    try:
        designer = Designer(
            name=data["name"],
            email=data["email"],
            ratings=data["ratings"],
            projects=data["projects"],
            phone=data["phone"],
            description=data["description"],
            isShortlisted=data["isShortlisted"],
            years=data["years"],
            price=data["price"],
        )

        designer.save()
        return jsonify({"message": "Designer added successfully."}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_all_designers():
    designers = Designer.objects()
    data = []

    for d in designers:
        doc = d.to_mongo().to_dict()
        doc["_id"] = str(doc["_id"])
        if d.created_at:
            doc["created_at"] = d.created_at.isoformat()
        if d.updated_at:
            doc["updated_at"] = d.updated_at.isoformat()
        data.append(doc)

    return jsonify(data), 200


def toggle_shortlisted():
    data = request.get_json()
    designer_id = data.get("designer_id")
    if not designer_id:
        return jsonify({"error": "designer_id is required"}), 400

    try:
        # Find the designer by id
        designer = Designer.objects(id=designer_id).first()
        if not designer:
            return jsonify({"error": "Designer not found"}), 404

        # Toggle the isShortlisted field
        designer.isShortlisted = not designer.isShortlisted
        designer.save()

        return (
            jsonify(
                {
                    "message": "isShortlisted toggled successfully",
                    "designer": {
                        "_id": {"$oid": str(designer.id)},
                        "isShortlisted": designer.isShortlisted,
                    },
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_shortlisted_designers():
    shortlisted = Designer.objects(isShortlisted=True)
    data = []

    for d in shortlisted:
        doc = d.to_mongo().to_dict()
        doc["_id"] = str(doc["_id"])
        if d.created_at:
            doc["created_at"] = d.created_at.isoformat()
        if d.updated_at:
            doc["updated_at"] = d.updated_at.isoformat()
        data.append(doc)

    return jsonify(data), 200
