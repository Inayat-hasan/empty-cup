from flask import Blueprint
from controllers.designer_controller import add_designer,get_all_designers,toggle_shortlisted,get_shortlisted_designers

designer_bp = Blueprint('designer_bp', __name__)

designer_bp.route('/designer/add', methods=['POST'])(add_designer)

designer_bp.route('/designer/getAll', methods=['GET'])(get_all_designers)

designer_bp.route('/designer/toggleShortlisted', methods=['PUT'])(toggle_shortlisted)

designer_bp.route('/designer/getShortlisted', methods=['GET'])(get_shortlisted_designers)
