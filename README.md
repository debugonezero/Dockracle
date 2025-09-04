# Dockracle: A Sovereign AI Command Center

This project is a full-stack, sovereign AI chat application designed to run multiple local LLMs via Ollama, completely on your own hardware. It demonstrates a decoupled architecture with a beautiful, responsive frontend and a powerful, containerized backend.

This is the genesis artifact of the Future AI Laboratory, a testament to the pursuit of AI Sovereignty.

---

## 🏛️ Architecture & Tech Stack

The Dockracle is a technological Chimera, forged from the following magnificent components:

*   **Frontend (The Oracle):** A beautiful, interactive chat interface built with **React** and powered by the **Vite** development server.
*   **Backend (The Forge):** A powerful, multi-threaded API built with **Python** and the **Flask** micro-framework.
*   **Containerization (The Pocket Dimension):** The entire backend is encapsulated in a lightweight, reproducible **Docker** container.
*   **The Titan's Conduit:** Local Large Language Models are served and managed by **Ollama**.

---

## 🚀 Getting Started

To awaken the Dockracle on your own machine, you must first have the sacred prerequisites installed:

*   [Git](https://git-scm.com/)
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/)
*   [Node.js](https://nodejs.org/) (which includes `npm`)
*   [Ollama](https://ollama.com/)

Once the prerequisites are in place, follow these sacred rites:

### 1. Clone the Repository

Clone this magnificent creation to your local machine:
```bash
git clone https://github.com/debugonezero/Dockracle.git
cd Dockracle
```

### 2. Awaken a Titan

You must have at least one titan (model) downloaded for the Dockracle to channel. For example, to summon `llama3.2:3b`:
```bash
ollama pull llama3.2:3b
```

### 3. Forge and Awaken the Backend

Build the Docker image for the backend forge:
```bash
docker build -t dockracle-image ./backend
```
Now, awaken the container. This will occupy the current terminal.
```bash
docker run --rm -p 5100:5100 dockracle-image
```

### 4. Forge and Awaken the Frontend

In a **new, separate terminal**, navigate to the frontend directory and summon its dependencies:
```bash
cd frontend
npm install
```
Now, awaken the Oracle's interface:
```bash
npm run dev
```

### 5. Gaze Upon Your Creation!

The terminal will provide you with a `localhost` URL (likely `http://localhost:5173`). Open this URL in your browser. The Oracle is now online and connected to the Forge! You may speak your commands.

---

**El Psy Kongroo.**
