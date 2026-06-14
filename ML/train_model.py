"""
ProNet - KNN Model Training
============================
This script trains a K-Nearest Neighbors model
to recommend professional connections.

HOW TO RUN:
  cd ML
  pip install scikit-learn pandas numpy joblib
  python train_model.py
"""

import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
import joblib
import os

print("=" * 50)
print("  ProNet - KNN Model Training")
print("=" * 50)

# ============================================================
# STEP 1: CREATE DATASET (200 fake professional profiles)
# ============================================================
print("\nStep 1: Creating dataset...")

np.random.seed(42)

industries = ['Technology', 'Finance', 'Healthcare', 'Marketing', 'Design', 'Data Science']
roles      = ['Software Engineer', 'Data Scientist', 'Product Manager', 'Designer',
              'Business Analyst', 'ML Engineer', 'Frontend Developer', 'Backend Developer']
all_skills = ['Python', 'Java', 'React', 'SQL', 'Machine Learning', 'Figma',
              'Excel', 'AWS', 'Docker', 'Tableau', 'Node.js', 'TensorFlow']

rows = []
for i in range(200):
    industry = np.random.choice(industries)
    role     = np.random.choice(roles)
    skill    = np.random.choice(all_skills)
    exp      = np.random.randint(0, 20)
    exp_level = 'Entry' if exp < 3 else ('Mid' if exp < 8 else 'Senior')

    rows.append({
        'name':      f'User_{i+1}',
        'industry':  industry,
        'role':      role,
        'skill':     skill,
        'exp_years': exp,
        'exp_level': exp_level
    })

df = pd.DataFrame(rows)

# Save dataset
os.makedirs('dataset', exist_ok=True)
df.to_csv('dataset/profiles.csv', index=False)
print(f"  Created {len(df)} profiles → saved to dataset/profiles.csv")

# ============================================================
# STEP 2: ENCODE FEATURES (convert text → numbers)
# ============================================================
print("\nStep 2: Encoding features...")

# Label Encoding = converts category text to numbers
# Example: "Technology" → 4, "Finance" → 1
le_industry  = LabelEncoder()
le_role      = LabelEncoder()
le_skill     = LabelEncoder()
le_exp_level = LabelEncoder()

df['industry_enc']  = le_industry.fit_transform(df['industry'])
df['role_enc']      = le_role.fit_transform(df['role'])
df['skill_enc']     = le_skill.fit_transform(df['skill'])
df['exp_level_enc'] = le_exp_level.fit_transform(df['exp_level'])

# Feature matrix
feature_cols = ['industry_enc', 'role_enc', 'skill_enc', 'exp_level_enc', 'exp_years']
X = df[feature_cols].values

# Scale all features to 0-1 range
scaler  = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

print(f"  Feature matrix shape: {X_scaled.shape}")

# ============================================================
# STEP 3: TRAIN KNN MODEL
# ============================================================
print("\nStep 3: Training KNN model...")

# KNN finds the K most similar profiles
# metric='cosine' measures angle between profile vectors
knn = NearestNeighbors(n_neighbors=6, metric='cosine', algorithm='brute')
knn.fit(X_scaled)

print("  KNN model trained! (k=5, cosine similarity)")

# ============================================================
# STEP 4: EVALUATE
# ============================================================
print("\nStep 4: Evaluating model...")

correct = 0
total   = 100

for _ in range(total):
    idx     = np.random.randint(0, len(X_scaled))
    dists, indices = knn.kneighbors(X_scaled[idx].reshape(1, -1), n_neighbors=6)
    neighbors = indices[0][1:]  # skip index 0 (itself)

    my_industry       = df.iloc[idx]['industry']
    neighbor_industries = df.iloc[neighbors]['industry'].values

    # Count how many neighbors are from same industry
    same = sum(1 for ind in neighbor_industries if ind == my_industry)
    if same >= 2:
        correct += 1

precision = correct / total
print(f"  Same-industry Precision: {precision:.0%}")
print(f"  (How often top 5 neighbors are from the same industry)")

# ============================================================
# STEP 5: SAVE MODEL
# ============================================================
print("\nStep 5: Saving model...")

os.makedirs('model', exist_ok=True)

model_bundle = {
    'knn':         knn,
    'scaler':      scaler,
    'le_industry': le_industry,
    'le_role':     le_role,
    'le_skill':    le_skill,
    'le_explevel': le_exp_level,
    'feature_cols': feature_cols,
    'data':        df
}

joblib.dump(model_bundle, 'model/knn_model.pkl')
print("  Model saved → model/knn_model.pkl")

# ============================================================
# DEMO: Show example recommendations
# ============================================================
print("\n" + "=" * 50)
print("  DEMO: Sample Recommendations")
print("=" * 50)

test = {
    'industry':  'Technology',
    'role':      'Software Engineer',
    'skill':     'Python',
    'exp_level': 'Mid',
    'exp_years': 4
}

print(f"\nTest user: {test['role']} in {test['industry']} ({test['exp_years']} years)")
print("\nTop 5 recommended connections:")
print("-" * 40)

# Encode test user
try:
    test_vec = [
        le_industry.transform([test['industry']])[0],
        le_role.transform([test['role']])[0],
        le_skill.transform([test['skill']])[0],
        le_exp_level.transform([test['exp_level']])[0],
        test['exp_years']
    ]
    test_scaled  = scaler.transform([test_vec])
    dists, inds  = knn.kneighbors(test_scaled, n_neighbors=6)

    for i, idx in enumerate(inds[0][1:]):
        person = df.iloc[idx]
        score  = round((1 - dists[0][i+1]) * 100, 1)
        print(f"  {i+1}. {person['name']}")
        print(f"     {person['role']} | {person['industry']} | {person['exp_years']} yrs")
        print(f"     Match Score: {score}%")
except Exception as e:
    print("  Could not run demo:", e)

print("\n" + "=" * 50)
print("  Done! Model is ready.")
print("  Now start the backend: cd ../Backend && python app.py")
print("=" * 50)
