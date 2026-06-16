"""
ProNet Backend - Flask
Run this file: python app.py
Then open Frontend/index.html in browser
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # This lets the frontend talk to backend

# ============================================================
# HEALTH CHECK - to test if backend is running
# ============================================================
@app.route('/api/health')
def health():
    return jsonify({ 'status': 'Backend is running!' })


# ============================================================
# GENERATIVE AI - Profile Summary & Networking Tips
# ============================================================
@app.route('/api/generate', methods=['POST'])
def generate():
    data   = request.get_json()
    prompt = data.get('prompt', '')

    if not prompt:
        return jsonify({ 'error': 'No prompt given' }), 400

    # ---- Try Google Gemini (free tier at aistudio.google.com) ----
    GEMINI_KEY = os.environ.get('GEMINI_API_KEY', '')
    if GEMINI_KEY:
        try:
            import requests as req
            url  = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_KEY
            body = { 'contents': [{ 'parts': [{ 'text': prompt }] }] }
            r    = req.post(url, json=body)
            text = r.json()['candidates'][0]['content']['parts'][0]['text']
            return jsonify({ 'result': text })
        except Exception as e:
            print('Gemini error:', e)

    # ---- Try OpenAI (if key is set) ----
    OPENAI_KEY = os.environ.get('OPENAI_API_KEY', '')
    if OPENAI_KEY:
        try:
            import requests as req
            headers = { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' }
            body    = { 'model': 'gpt-3.5-turbo', 'messages': [{ 'role': 'user', 'content': prompt }], 'max_tokens': 300 }
            r       = req.post('https://api.openai.com/v1/chat/completions', headers=headers, json=body)
            text    = r.json()['choices'][0]['message']['content']
            return jsonify({ 'result': text })
        except Exception as e:
            print('OpenAI error:', e)

    # ---- Fallback: Build simple response without API ----
    result = simple_generate(prompt)
    return jsonify({ 'result': result })


def simple_generate(prompt):
    """Simple rule-based text generation when no API key is available."""
    p = prompt.lower()

    if 'summary' in p or 'profile' in p:
        # Extract info from prompt lines
        lines    = prompt.split('\n')
        job      = 'Professional'
        industry = 'the industry'
        skills   = 'various skills'
        exp      = '0'
        for line in lines:
            if line.startswith('Job:'):      job      = line.replace('Job:', '').strip()
            if line.startswith('Industry:'): industry = line.replace('Industry:', '').strip()
            if line.startswith('Skills:'):   skills   = line.replace('Skills:', '').strip()
            if line.startswith('Experience:'): exp    = line.replace('Experience:', '').strip().replace(' years', '')
        return (
            f"I am a dedicated {job} with {exp} years of experience in {industry}. "
            f"My expertise includes {skills}, which I use to deliver high-quality and impactful work. "
            f"I am passionate about continuous learning, teamwork, and building meaningful professional connections. "
            f"Always excited to collaborate on new challenges and create real-world impact!"
        )

    elif 'tip' in p or 'networking' in p or 'insight' in p:
        job      = 'Professional'
        industry = 'the industry'
        for line in prompt.split('\n'):
            if line.startswith('Job:'):      job      = line.replace('Job:', '').strip()
            if line.startswith('Industry:'): industry = line.replace('Industry:', '').strip()
        return (
            f"1. Connect with 3 new {job} professionals every week — consistency builds a strong network over time.\n\n"
            f"2. Join {industry} communities on LinkedIn and ProNet, and actively participate in discussions to increase visibility.\n\n"
            f"3. Share your project wins and learnings regularly — people connect with those who demonstrate expertise and generosity."
        )

    return "Please provide more details in your profile for better AI responses!"


# ============================================================
# RUN THE SERVER
# ============================================================
if __name__ == '__main__':
    print('=' * 50)
    print('  ProNet Backend is starting...')
    print('  URL: http://127.0.0.1:5000')
    print('=' * 50)
    print()
    print('  To enable real AI responses, set:')
    print('  Windows: set GEMINI_API_KEY=your_key')
    print('  Mac/Linux: export GEMINI_API_KEY=your_key')
    print('  (Free key at: aistudio.google.com)')
    print()
    app.run(debug=True, port=5000)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)