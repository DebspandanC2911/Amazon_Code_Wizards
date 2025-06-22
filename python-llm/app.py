from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from model import load_model, predict_fake

app = FastAPI(title="Fake Review Detection API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model on startup
model, tokenizer = load_model()

class ReviewInput(BaseModel):
    reviewText: str

class ReviewOutput(BaseModel):
    isPotentiallyFake: bool
    confidence: float

@app.post("/api/llm/detect-fake", response_model=ReviewOutput)
async def detect_fake_review(review: ReviewInput):
    """
    Detect if a review is potentially fake using ML model
    """
    try:
        if not review.reviewText.strip():
            raise HTTPException(status_code=400, detail="Review text cannot be empty")
        
        # Get prediction from model
        confidence_score = predict_fake(model, tokenizer, review.reviewText)
        
        # Consider review fake if confidence is below threshold
        is_fake = confidence_score < 0.3
        
        return ReviewOutput(
            isPotentiallyFake=is_fake,
            confidence=float(confidence_score)
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing review: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
