import ollama
import random
from flask import Flask, request, jsonify
from flask_cors import CORS

# We create a client that knows how to find Ollama on the HOST machine.
client = ollama.Client(host='http://host.docker.internal:11434')

app = Flask(__name__)
CORS(app) # Grant diplomatic immunity

def generate_divergence_number():
    """Generates a pseudo-random divergence number, like in the show."""
    return f"{random.uniform(0, 2):.6f}"

@app.route('/summon', methods=['POST'])
def summon_titan():
    """
    Receives a prompt and a model name, summons the titan three times with
    slight variations, and returns three potential world lines (Alpha, Beta, Gamma).
    """
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    prompt_text = data.get('prompt')
    model_name = data.get('model')

    if not prompt_text or not model_name:
        return jsonify({"error": "Missing 'prompt' or 'model' in request body"}), 400

    try:
        worldlines = []
        temperatures = [0.6, 0.8, 1.0] # Introduce chaos via temperature

        for i, temp in enumerate(temperatures):
            response = client.chat(
                model=model_name,
                messages=[{'role': 'user', 'content': prompt_text}],
                options={'temperature': temp}
            )
            
            worldline_id = ['alpha', 'beta', 'gamma'][i]
            titan_response = response['message']['content']
            
            worldlines.append({
                "id": worldline_id,
                "text": titan_response,
                "divergence": generate_divergence_number()
            })
        
        return jsonify({"worldlines": worldlines})

    except Exception as e:
        print(f"An error occurred: {e}", flush=True)
        return jsonify({"error": "Failed to communicate with the titan"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5100, debug=True)
