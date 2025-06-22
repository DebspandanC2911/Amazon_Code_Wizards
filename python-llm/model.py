import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import numpy as np
import re
import string
from collections import Counter
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
import enchant
import statistics

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

def load_model():
    """
    Load pre-trained models for fake review detection
    Using multiple models for better accuracy
    """
    try:
        # Primary sentiment analysis model
        model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForSequenceClassification.from_pretrained(model_name)
        
        # Secondary emotion detection model for more nuanced analysis
        emotion_classifier = pipeline(
            "text-classification",
            model="j-hartmann/emotion-english-distilroberta-base",
            device=-1  # Use CPU
        )
        
        print(f"Models loaded successfully")
        return {
            'sentiment_model': model,
            'sentiment_tokenizer': tokenizer,
            'emotion_classifier': emotion_classifier
        }, tokenizer
    
    except Exception as e:
        print(f"Error loading models: {e}")
        return None, None

def preprocess_text(text):
    """
    Advanced text preprocessing for fake review detection
    """
    if not text or not isinstance(text, str):
        return ""
    
    # Remove extra whitespace and normalize
    text = re.sub(r'\s+', ' ', text.strip())
    
    # Keep original for some analyses, create cleaned version for others
    original_text = text
    
    # Remove special characters but keep basic punctuation for structure analysis
    cleaned_text = re.sub(r'[^\w\s.,!?-]', '', text)
    
    return original_text, cleaned_text

def detect_gibberish(text):
    """
    Detect gibberish or nonsensical text patterns
    """
    if not text or len(text.strip()) < 3:
        return True, 0.9, "Text too short"
    
    gibberish_indicators = []
    
    # Initialize spell checker
    try:
        spell_checker = enchant.Dict("en_US")
    except:
        spell_checker = None
    
    words = re.findall(r'\b[a-zA-Z]+\b', text.lower())
    
    if len(words) == 0:
        return True, 0.95, "No valid words found"
    
    # 1. Spelling accuracy check
    if spell_checker:
        misspelled_count = sum(1 for word in words if len(word) > 2 and not spell_checker.check(word))
        spelling_error_ratio = misspelled_count / len(words) if words else 1
        
        if spelling_error_ratio > 0.4:  # More than 40% misspelled
            gibberish_indicators.append(("high_misspelling", spelling_error_ratio))
    
    # 2. Consonant/vowel ratio analysis
    vowels = set('aeiou')
    consonant_heavy_words = 0
    
    for word in words:
        if len(word) > 3:
            vowel_count = sum(1 for char in word if char in vowels)
            consonant_count = len(word) - vowel_count
            
            if consonant_count > vowel_count * 3:  # Too many consonants
                consonant_heavy_words += 1
    
    consonant_ratio = consonant_heavy_words / len(words) if words else 0
    if consonant_ratio > 0.3:
        gibberish_indicators.append(("consonant_heavy", consonant_ratio))
    
    # 3. Repetitive character patterns
    repetitive_patterns = re.findall(r'(.)\1{3,}', text.lower())  # Same char 4+ times
    if repetitive_patterns:
        gibberish_indicators.append(("repetitive_chars", len(repetitive_patterns)))
    
    # 4. Random character sequences
    random_sequences = re.findall(r'\b[bcdfghjklmnpqrstvwxyz]{4,}\b', text.lower())
    if random_sequences:
        gibberish_indicators.append(("random_consonants", len(random_sequences)))
    
    # 5. Keyboard mashing patterns
    keyboard_rows = [
        'qwertyuiop',
        'asdfghjkl',
        'zxcvbnm'
    ]
    
    for row in keyboard_rows:
        for i in range(len(row) - 3):
            pattern = row[i:i+4]
            if pattern in text.lower() or pattern[::-1] in text.lower():
                gibberish_indicators.append(("keyboard_mashing", pattern))
    
    # Calculate gibberish score
    if len(gibberish_indicators) >= 2:
        return True, 0.8 + len(gibberish_indicators) * 0.05, f"Multiple indicators: {gibberish_indicators}"
    elif len(gibberish_indicators) == 1:
        indicator_type, value = gibberish_indicators[0]
        if indicator_type == "high_misspelling" and value > 0.6:
            return True, 0.85, f"High misspelling rate: {value:.2f}"
        elif indicator_type == "consonant_heavy" and value > 0.5:
            return True, 0.8, f"Too many consonant-heavy words: {value:.2f}"
    
    return False, 0.1, "Text appears legitimate"

def analyze_fake_patterns(text):
    """
    Detect common fake review patterns with enhanced accuracy
    """
    text_lower = text.lower()
    fake_score = 0
    detected_patterns = []
    
    # Enhanced fake review indicators with weighted scoring
    fake_patterns = {
        # Generic praise patterns (high weight)
        'generic_praise': {
            'patterns': [
                r'\b(superb|excellent|amazing|fantastic|incredible|outstanding|phenomenal)\s+(quality|product|item)\b',
                r'\bfits\s+perfectly?\b',
                r'\bhighly\s+recommend\b',
                r'\bbest\s+(product|purchase|buy)\s+(ever|i\'?ve\s+made)\b',
                r'\b(love|loved)\s+it\b',
                r'\b(perfect|exactly)\s+what\s+i\s+(wanted|needed)\b',
                r'\bgreat\s+(value|price|deal)\b',
                r'\bfast\s+(delivery|shipping)\b',
                r'\bpackaging\s+was\s+(great|excellent|perfect)\b'
            ],
            'weight': 2.0
        },
        
        # Extreme language patterns
        'extreme_language': {
            'patterns': [
                r'\b(absolutely|totally|completely|extremely)\s+(perfect|amazing|love)\b',
                r'\b(never|nothing)\s+(wrong|bad|negative)\b',
                r'\b(everything|all)\s+(perfect|great|amazing)\b',
                r'\b(zero|no)\s+(complaints|issues|problems)\b'
            ],
            'weight': 1.8
        },
        
        # Repetitive superlatives
        'superlatives': {
            'patterns': [
                r'\b(best|greatest|most\s+amazing|top\s+quality)\b',
                r'\b(five|5)\s+stars?\b',
                r'\b(ten|10)\s+out\s+of\s+(ten|10)\b',
                r'\b(must\s+buy|must\s+have|life\s+changing)\b'
            ],
            'weight': 1.5
        },
        
        # Generic delivery/service praise
        'service_praise': {
            'patterns': [
                r'\bdelivered\s+on\s+time\b',
                r'\bfast\s+(shipping|delivery)\b',
                r'\bgreat\s+(customer\s+)?service\b',
                r'\bno\s+(issues|problems)\s+with\s+(delivery|shipping)\b'
            ],
            'weight': 1.3
        },
        
        # Vague descriptions
        'vague_descriptions': {
            'patterns': [
                r'\b(good|nice|fine|okay)\s+(product|item|quality)\b',
                r'\bas\s+(described|expected|advertised)\b',
                r'\bwhat\s+you\s+(see|expect)\b',
                r'\bdoes\s+the\s+job\b'
            ],
            'weight': 1.0
        },
        
        # Suspicious enthusiasm
        'suspicious_enthusiasm': {
            'patterns': [
                r'!{2,}',  # Multiple exclamation marks
                r'\b(wow|omg|amazing){2,}\b',  # Repeated enthusiasm
                r'\b(so\s+so\s+|very\s+very\s+)(good|great|amazing)\b'
            ],
            'weight': 1.2
        }
    }
    
    # Check for patterns
    for category, data in fake_patterns.items():
        category_matches = 0
        for pattern in data['patterns']:
            matches = re.findall(pattern, text_lower)
            if matches:
                category_matches += len(matches)
                detected_patterns.append((category, pattern, matches))
        
        if category_matches > 0:
            fake_score += category_matches * data['weight']
    
    return fake_score, detected_patterns

def analyze_linguistic_features(text):
    """
    Analyze linguistic features that indicate fake reviews
    """
    features = {}
    
    # Tokenize text
    try:
        sentences = sent_tokenize(text)
        words = word_tokenize(text.lower())
        stop_words = set(stopwords.words('english'))
    except:
        sentences = text.split('.')
        words = text.lower().split()
        stop_words = set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'])
    
    # Basic statistics
    features['word_count'] = len(words)
    features['sentence_count'] = len(sentences)
    features['avg_sentence_length'] = len(words) / len(sentences) if sentences else 0
    
    # Vocabulary diversity
    unique_words = set(words)
    features['vocabulary_diversity'] = len(unique_words) / len(words) if words else 0
    
    # Stop word ratio
    stop_word_count = sum(1 for word in words if word in stop_words)
    features['stop_word_ratio'] = stop_word_count / len(words) if words else 0
    
    # Punctuation analysis
    punctuation_count = sum(1 for char in text if char in string.punctuation)
    features['punctuation_ratio'] = punctuation_count / len(text) if text else 0
    
    # Exclamation marks (fake reviews often overuse them)
    features['exclamation_ratio'] = text.count('!') / len(text) if text else 0
    
    # Capital letters ratio (excessive caps can indicate fake enthusiasm)
    capital_count = sum(1 for char in text if char.isupper())
    features['capital_ratio'] = capital_count / len(text) if text else 0
    
    return features

def calculate_authenticity_score(text, sentiment_scores, emotion_scores, linguistic_features, fake_patterns_score, gibberish_result):
    """
    Calculate comprehensive authenticity score
    """
    is_gibberish, gibberish_score, gibberish_reason = gibberish_result
    
    # If text is gibberish, it's definitely fake
    if is_gibberish:
        return 0.05, f"Gibberish detected: {gibberish_reason}"
    
    # Start with base authenticity score
    authenticity = 0.7
    reasons = []
    
    # 1. Fake patterns analysis (most important)
    if fake_patterns_score > 5:
        authenticity -= 0.4
        reasons.append(f"High fake pattern score: {fake_patterns_score:.1f}")
    elif fake_patterns_score > 3:
        authenticity -= 0.25
        reasons.append(f"Moderate fake pattern score: {fake_patterns_score:.1f}")
    elif fake_patterns_score > 1:
        authenticity -= 0.1
        reasons.append(f"Some fake patterns detected: {fake_patterns_score:.1f}")
    
    # 2. Sentiment extremity (very positive reviews are often fake)
    if sentiment_scores and len(sentiment_scores) >= 3:
        positive_score = sentiment_scores[2]  # Positive sentiment
        if positive_score > 0.9:
            authenticity -= 0.2
            reasons.append(f"Extremely positive sentiment: {positive_score:.2f}")
        elif positive_score > 0.8:
            authenticity -= 0.1
            reasons.append(f"Very positive sentiment: {positive_score:.2f}")
    
    # 3. Emotion analysis
    if emotion_scores:
        joy_score = next((score['score'] for score in emotion_scores if score['label'] == 'joy'), 0)
        if joy_score > 0.8:
            authenticity -= 0.15
            reasons.append(f"Excessive joy emotion: {joy_score:.2f}")
    
    # 4. Linguistic features analysis
    if linguistic_features:
        # Very short reviews are suspicious
        if linguistic_features['word_count'] < 10:
            authenticity -= 0.15
            reasons.append("Very short review")
        
        # Very low vocabulary diversity (repetitive language)
        if linguistic_features['vocabulary_diversity'] < 0.5:
            authenticity -= 0.1
            reasons.append(f"Low vocabulary diversity: {linguistic_features['vocabulary_diversity']:.2f}")
        
        # Excessive exclamation marks
        if linguistic_features['exclamation_ratio'] > 0.05:  # More than 5% exclamation marks
            authenticity -= 0.1
            reasons.append(f"Excessive exclamation marks: {linguistic_features['exclamation_ratio']:.2f}")
        
        # Excessive capital letters
        if linguistic_features['capital_ratio'] > 0.15:  # More than 15% capitals
            authenticity -= 0.1
            reasons.append(f"Excessive capital letters: {linguistic_features['capital_ratio']:.2f}")
        
        # Unusual sentence structure
        if linguistic_features['avg_sentence_length'] < 3:
            authenticity -= 0.1
            reasons.append("Very short sentences")
        elif linguistic_features['avg_sentence_length'] > 30:
            authenticity -= 0.05
            reasons.append("Very long sentences")
    
    # 5. Bonus for authentic indicators
    authentic_indicators = [
        r'\b(however|but|although|though|except)\b',  # Contrasting language
        r'\b(minor|small|slight)\s+(issue|problem|complaint)\b',  # Balanced criticism
        r'\b(could\s+be\s+better|improvement|wish)\b',  # Constructive feedback
        r'\b(compared\s+to|versus|vs\.?)\b',  # Comparative language
        r'\b(after\s+(using|trying)|been\s+using)\b',  # Experience over time
        r'\b(pros\s+and\s+cons|advantages\s+and\s+disadvantages)\b'  # Balanced review
    ]
    
    authentic_count = sum(1 for pattern in authentic_indicators if re.search(pattern, text.lower()))
    if authentic_count > 0:
        authenticity += min(0.2, authentic_count * 0.05)
        reasons.append(f"Authentic indicators found: {authentic_count}")
    
    # Ensure score is within bounds
    authenticity = max(0.01, min(0.99, authenticity))
    
    return authenticity, "; ".join(reasons) if reasons else "No significant issues detected"

def predict_fake(models, tokenizer, review_text):
    """
    Enhanced fake review prediction with multiple analysis layers
    """
    if not models or not review_text:
        return simple_fake_detection(review_text)
    
    try:
        # Preprocess text
        original_text, cleaned_text = preprocess_text(review_text)
        
        # 1. Gibberish detection (first line of defense)
        gibberish_result = detect_gibberish(cleaned_text)
        
        # 2. Fake pattern analysis
        fake_patterns_score, detected_patterns = analyze_fake_patterns(original_text)
        
        # 3. Linguistic feature analysis
        linguistic_features = analyze_linguistic_features(original_text)
        
        # 4. Sentiment analysis
        sentiment_scores = None
        if models.get('sentiment_model') and models.get('sentiment_tokenizer'):
            try:
                inputs = models['sentiment_tokenizer'](cleaned_text, return_tensors="pt", truncation=True, max_length=512)
                with torch.no_grad():
                    outputs = models['sentiment_model'](**inputs)
                    sentiment_scores = torch.nn.functional.softmax(outputs.logits, dim=-1)[0].numpy()
            except Exception as e:
                print(f"Sentiment analysis error: {e}")
        
        # 5. Emotion analysis
        emotion_scores = None
        if models.get('emotion_classifier'):
            try:
                emotion_result = models['emotion_classifier'](cleaned_text)
                emotion_scores = emotion_result if isinstance(emotion_result, list) else [emotion_result]
            except Exception as e:
                print(f"Emotion analysis error: {e}")
        
        # 6. Calculate final authenticity score
        authenticity_score, reasoning = calculate_authenticity_score(
            original_text, sentiment_scores, emotion_scores, 
            linguistic_features, fake_patterns_score, gibberish_result
        )
        
        # Log detailed analysis for debugging
        print(f"Review Analysis:")
        print(f"  Text: {original_text[:100]}...")
        print(f"  Gibberish: {gibberish_result[0]} (score: {gibberish_result[1]:.2f})")
        print(f"  Fake patterns score: {fake_patterns_score:.1f}")
        print(f"  Detected patterns: {len(detected_patterns)}")
        print(f"  Final authenticity: {authenticity_score:.2f}")
        print(f"  Reasoning: {reasoning}")
        
        return authenticity_score
        
    except Exception as e:
        print(f"Error in enhanced prediction: {e}")
        return simple_fake_detection(review_text)

def simple_fake_detection(text):
    """
    Fallback simple heuristic-based fake review detection
    Enhanced version of the original function
    """
    if not text:
        return 0.1
    
    text_lower = text.lower()
    
    # Enhanced suspicious patterns
    fake_indicators = [
        'superb quality', 'fits perfectly', 'highly recommend',
        'best product ever', 'amazing quality', 'perfect in every way',
        'five stars', '5 stars', 'must buy', 'life changing',
        'incredible', 'outstanding', 'phenomenal', 'delivered on time',
        'packaging was great', 'fast shipping', 'great service',
        'exactly what i wanted', 'love it', 'perfect product'
    ]
    
    # Quality indicators for real reviews
    real_indicators = [
        'however', 'but', 'although', 'except', 'minor issue',
        'small problem', 'could be better', 'improvement',
        'compared to', 'after using', 'weeks', 'months', 'days',
        'pros and cons', 'wish it had', 'not perfect'
    ]
    
    fake_score = sum(2 if indicator in text_lower else 0 for indicator in fake_indicators)
    real_score = sum(1 for indicator in real_indicators if indicator in text_lower)
    
    # Length analysis
    word_count = len(text.split())
    if word_count < 8:  # Very short reviews are suspicious
        fake_score += 3
    elif word_count > 100:  # Very detailed reviews are more likely real
        real_score += 2
    
    # Repetition analysis
    words = text_lower.split()
    if len(words) > 0:
        unique_words = set(words)
        repetition_ratio = len(unique_words) / len(words)
        if repetition_ratio < 0.6:  # High repetition
            fake_score += 2
    
    # Exclamation mark analysis
    exclamation_count = text.count('!')
    if exclamation_count > 2:
        fake_score += exclamation_count
    
    # Calculate confidence
    total_indicators = fake_score + real_score
    if total_indicators == 0:
        return 0.5
    
    confidence = (real_score + 1) / (fake_score + real_score + 2)
    return max(0.05, min(0.95, confidence))
