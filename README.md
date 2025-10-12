🚀 Custom Semantic Search Engine: Architectural Overview
A high-performance, full-stack application demonstrating expertise in modern web services, intelligent search integration, and robust data filtering. This engine interprets natural language queries using a specialized API and presents results through a dynamic interface.

🛠️ Technology Stack
Component

Framework / Language

Role & Complexity

Backend

Python (FastAPI)

Manages secure API key usage, handles all external service calls (Exa API), implements query rewriting logic, and provides a validated, high-speed RESTful interface to the frontend.

Frontend

React

Modern, component-based UI for intuitive user interaction, state management, and asynchronous data fetching.

Core Service

Exa API

Provides advanced semantic search capabilities and natural language processing (NLP) grounding.

Security

Python dotenv

Ensures secure handling and isolation of critical credentials (e.g., EXA_API_KEY) away from source code.

✨ Key Technical Achievements
This project showcases full-stack development proficiency with a focus on delivering high-quality, filterable search results.

Intelligent Query Optimization: Implemented query rewriting (autoprompt) on the backend to dynamically refine vague user input, maximizing search precision without user intervention.

Decoupled Architecture: Utilized a clean FastAPI / React split, facilitating independent scaling and maintenance of the API and presentation layers.

Advanced Filtering: Developed complex logic to filter semantic search results based on user-defined constraints, including Domain/URL filtering and date range limitations (e.g., results since '2024-01-01').

Secure Credential Management: Enforced industry best practices by loading all environment variables and sensitive keys via .env files, ensuring security compliance.

⚙️ Quick Local Deployment
The application requires a seamless two-step deployment process.

Prerequisites
Python 3.8+

Node.js & npm/yarn

A valid Exa API Key.

Setup Instructions
Configuration: Create a file named .env in the root directory and define your key:

EXA_API_KEY="your_secret_exa_api_key_here"

Backend (FastAPI):

cd backend
pip install -r requirements.txt
python3 main.py  # Runs server on [http://127.0.0.1:8000](http://127.0.0.1:8000)

Frontend (React):

cd frontend
npm install
npm start # Opens the UI on http://localhost:3000
