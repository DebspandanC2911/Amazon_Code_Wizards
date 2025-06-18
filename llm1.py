
import pandas as pd
import numpy as np
import re

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import OneHotEncoder, StandardScaler, LabelEncoder
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report
from scipy.sparse import hstack

# 1. Load data
train_df = pd.read_csv("data_files/train (1).csv")
test_df  = pd.read_csv("data_files/test_unlabeled.csv")

# 2. Text cleaning
def clean_text(text):
    text = re.sub(r'[^a-zA-Z0-9\s]', '', str(text))
    text = re.sub(r'\s+', ' ', text)
    return text.strip().lower()

train_df['clean_text'] = train_df['text_'].apply(clean_text)
test_df ['clean_text'] = test_df ['text_'].apply(clean_text)

# 3. TF-IDF (unigrams + bigrams)
tfidf = TfidfVectorizer(max_features=8000, stop_words='english', ngram_range=(1,2))
X_text        = tfidf.fit_transform(train_df['clean_text'])
X_test_text   = tfidf.transform(test_df['clean_text'])

# 4. One-hot encode category
cat_enc      = OneHotEncoder(sparse_output=True, handle_unknown='ignore')
X_cat        = cat_enc.fit_transform(train_df[['category']])
X_test_cat   = cat_enc.transform(   test_df[['category']])

# 5. Scale rating
scaler       = StandardScaler()
X_rating     = scaler.fit_transform(train_df[['rating']])
X_test_rating= scaler.transform(   test_df[['rating']])

# 6. Combine features
X            = hstack([X_text, X_cat, X_rating])
X_test_final = hstack([X_test_text, X_test_cat, X_test_rating])

# 7. Encode labels (CG→0, OR→1)
lbl_enc = LabelEncoder()
y       = lbl_enc.fit_transform(train_df['label'])  

# 8. Train/validation split
X_train, X_val, y_train, y_val = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 9. Train XGBoost
clf = XGBClassifier(
    use_label_encoder=False,
    eval_metric='mlogloss',
    n_estimators=300,
    max_depth=6
)
clf.fit(X_train, y_train)

# 10. Validate
y_val_pred = clf.predict(X_val)
print("✅ Validation Accuracy:", accuracy_score(y_val, y_val_pred))
print("\n📊 Classification Report:")
print(classification_report(
    y_val, y_val_pred,
    target_names=lbl_enc.classes_
))

# 11. Feature importances (top 10)
#    Map feature indices → names
tfidf_names = list(tfidf.get_feature_names_out())
cat_names   = list(cat_enc.get_feature_names_out(['category']))
all_names   = tfidf_names + cat_names + ['rating']
importances = clf.feature_importances_
feat_imp    = pd.Series(importances, index=all_names)
top10       = feat_imp.nlargest(10)
print("\n🔑 Top 10 Important Features:")
print(top10)

# 12. Predict on test set
y_test_pred = clf.predict(X_test_final)
test_df['predicted_label'] = lbl_enc.inverse_transform(y_test_pred)

# 13. Compute trust score & flag
#    prob of CG (genuine) = proba[:, index_of_CG]
proba = clf.predict_proba(X_test_final)
idx_cg = list(lbl_enc.classes_).index('CG')
test_df['trust_score']   = proba[:, idx_cg]
test_df['flagged_review']= test_df['trust_score'] < 0.30  # e.g. <30% trustworthy

# 14. Save results
cols = ['category','rating','text_','predicted_label','trust_score','flagged_review']
test_df[cols].to_csv("predicted_test_output_trust.csv", index=False)

print("\n✅ Saved predictions to predicted_test_output_trust.csv")
