import re
import pandas as pd
import numpy as np

from scipy.sparse import hstack
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import OneHotEncoder, StandardScaler, LabelEncoder
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report


def clean_text(text):
    text = re.sub(r'[^a-zA-Z0-9\s]', '', str(text))
    text = re.sub(r'\s+', ' ', text)
    return text.strip().lower()


def predict_review(text, category, rating, tfidf, cat_enc, scaler, clf, lbl_enc, idx_cg, threshold=0.30):
    # Clean input text
    clean = clean_text(text)
    # Transform features
    X_t = tfidf.transform([clean])
    X_c = cat_enc.transform([[category]])
    X_r = scaler.transform([[rating]])
    sample = hstack([X_t, X_c, X_r])
    # Predict
    probs = clf.predict_proba(sample)[0]
    trust = probs[idx_cg]
    label = lbl_enc.inverse_transform([np.argmax(probs)])[0]
    flagged = trust < threshold
    return label, round(float(trust), 4), bool(flagged)


def main():
    # 1. Load
    train_df = pd.read_csv("data_files/train (1).csv")
    test_df  = pd.read_csv("data_files/test_unlabeled.csv")

    # 2. Clean
    train_df['clean_text'] = train_df['text_'].apply(clean_text)
    test_df ['clean_text'] = test_df ['text_'].apply(clean_text)

    # 3. TF-IDF
    tfidf = TfidfVectorizer(max_features=8000, stop_words='english', ngram_range=(1,2))
    X_text      = tfidf.fit_transform(train_df['clean_text'])
    X_test_text = tfidf.transform(test_df['clean_text'])

    # 4. Category encoding
    cat_enc    = OneHotEncoder(sparse_output=True, handle_unknown='ignore')
    X_cat      = cat_enc.fit_transform(train_df[['category']])
    X_test_cat = cat_enc.transform(test_df[['category']])

    # 5. Rating scaling
    scaler        = StandardScaler()
    X_rating      = scaler.fit_transform(train_df[['rating']])
    X_test_rating = scaler.transform(test_df[['rating']])

    # 6. Combine
    X            = hstack([X_text, X_cat, X_rating])
    X_test_final = hstack([X_test_text, X_test_cat, X_test_rating])

    # 7. Labels
    lbl_enc = LabelEncoder()
    y       = lbl_enc.fit_transform(train_df['label'])

    # 8. Split
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

    # 9. Train
    clf = XGBClassifier(use_label_encoder=False, eval_metric='mlogloss', n_estimators=300, max_depth=6)
    clf.fit(X_train, y_train)

    # 10. Validate
    y_val_pred = clf.predict(X_val)
    print("✅ Validation Accuracy:", accuracy_score(y_val, y_val_pred))
    print(classification_report(y_val, y_val_pred, target_names=lbl_enc.classes_))

    # Precompute index of genuine class
    idx_cg = list(lbl_enc.classes_).index('CG')

    # Interactive loop
    print("\nEnter review details to predict ('exit' to quit)")
    while True:
        text = input("Review text: ")
        if text.strip().lower() == 'exit':
            break
        category = input("Category: ")
        try:
            rating = float(input("Rating (numeric): "))
        except ValueError:
            print("Invalid rating, please enter a number.")
            continue

        label, trust, flagged = predict_review(
            text, category, rating,
            tfidf, cat_enc, scaler, clf, lbl_enc, idx_cg
        )
        print(f"\n→ Predicted Label : {label}")
        print(f"→ Trust Score     : {trust}")
        print(f"→ Flagged Review  : {flagged}\n")

    print("Goodbye!")


if __name__ == "__main__":
    main()

