# ProNet - Professional Networking Platform

## What is this?
A LinkedIn-style professional networking app with:
- User Registration & Login
- Professional Profiles
- 30+ People to Connect With
- AI-Powered Connection Recommendations (KNN)
- AI Profile Summary Generator (GenAI)
- Posts, Feed, Jobs, Messages

---

## How to Run (Simple Steps)

### Option 1: Frontend Only (Easiest - No Setup!)
1. Unzip the project
2. Open `Frontend/index.html` with Live Server in VS Code
3. Register → Fill your profile → Start connecting!
- Everything works without backend
- 30 demo users are ready to connect with

### Option 2: Full Stack (For AI Features)

**Step 1 - Train ML Model (do this once):**
```
cd ML
pip install scikit-learn pandas numpy joblib
python train_model.py
```

**Step 2 - Start Backend:**
```
cd Backend
pip install -r requirements.txt
python app.py
```

**Step 3 - Open Frontend:**
- Right-click `Frontend/index.html` → Open with Live Server

**Step 4 - (Optional) Real AI:**
```
set GEMINI_API_KEY=your_free_key_here
python app.py
```
Get free key at: https://aistudio.google.com

---

## Project Structure
```
ProNet/
├── Frontend/
│   ├── index.html      → Login & Register
│   ├── dashboard.html  → Home + AI Recommendations
│   ├── people.html     → Find & Connect with People
│   ├── profile.html    → Your Profile + AI Summary
│   ├── feed.html       → Posts & Feed
│   ├── jobs.html       → Job Listings
│   ├── messages.html   → Chat
│   ├── css/style.css   → All Styles
│   └── js/             → JavaScript files
├── Backend/
│   ├── app.py          → Flask Server
│   └── requirements.txt
├── ML/
│   ├── train_model.py       → Train KNN Model
│   ├── ProNet_KNN_Notebook.ipynb → Jupyter Notebook
│   ├── dataset/             → CSV dataset
│   └── model/               → Saved .pkl model
└── README.md
```

---

## Technologies Used
| Part | Technology |
|------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Python Flask |
| ML Algorithm | K-Nearest Neighbors (KNN) |
| Generative AI | Google Gemini / Fallback |
| Storage | Browser localStorage |
| Model Saving | joblib (.pkl file) |
