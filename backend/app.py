from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import re

app = Flask(__name__)
CORS(app)

# Load the model data
with open("tourism_model.pkl", "rb") as f:
    model_data = pickle.load(f)
    df = model_data['data']
    cosine_sim = model_data['similarity']

@app.route("/")
def index():
    return "Tourism recommendation API is running!"

def get_base_name(name):
    """Removes trailing numbers from place names, e.g., 'Ajanta Caves 14' -> 'Ajanta Caves'."""
    return re.sub(r'\s+\d+$', '', name.strip())

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        location_input = data.get("place", "").strip().lower()

        if not location_input:
            return jsonify(success=False, error="No location provided."), 400

        df['location'] = df['location'].astype(str)
        matched_places = df[df['location'].str.lower() == location_input]

        if matched_places.empty:
            return jsonify(success=False, error=f"No matches found for location '{location_input}'")

        # Get list of all matched names
        all_names = matched_places["name"].tolist()

        # Filter out duplicates using base name
        seen = set()
        unique_names = []
        for name in all_names:
            base = get_base_name(name)
            if base not in seen:
                seen.add(base)
                unique_names.append(base)

        return jsonify(success=True, location=location_input.title(), places=unique_names)

    except Exception as e:
        return jsonify(success=False, error=str(e)), 500

if __name__ == "__main__":
    app.run(debug=True)
