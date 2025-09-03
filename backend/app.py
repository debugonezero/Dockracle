import ollama
from flask import Flask, request, jsonify
from flask_cors import CORS # We import the diplomatic envoy!

# This is the critical change for Docker!
# We are creating a client that knows how to find Ollama on the HOST machine.
# 'host.docker.internal' is a special DNS name that Docker provides for this purpose.
client = ollama.Client(host='http://host.docker.internal:11434')

app = Flask(__name__)
CORS(app) # We grant diplomatic immunity to our app!

@app.route('/summon', methods=['POST'])
def summon_titan():
    """
    Receives a prompt and returns a response from the Llama model via the host's Ollama service.
    """
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    prompt_text = data.get('prompt')

    if not prompt_text:
        return jsonify({"error": "Missing 'prompt' in request body"}), 400

    try:
        response = client.chat(
            model='llama3.2:3b',  # We pivot to a model that is already present!
            messages=[{'role': 'user', 'content': prompt_text}]
        )
        titan_response = response['message']['content']
        return jsonify({"response": titan_response})

    except Exception as e:
        # The critical change is here! We force the buffer to flush!
        print(f"An error occurred: {e}", flush=True)
        return jsonify({"error": "Failed to communicate with the titan"}), 500

if __name__ == '__main__':
    # We listen on 0.0.0.0 to be accessible from outside the container
    app.run(host='0.0.0.0', port=5100, debug=True)