from flask import Blueprint, request, jsonify
from utils.ai_client import get_priority_suggestion

ai_routes = Blueprint("ai_routes", __name__)
@ai_routes.route("/api/ai/priorities", methods=["POST"])

def priorities():
    tasks = request.json.get("tasks", [])
    result = get_priority_suggestion(tasks)
    return jsonify(result)