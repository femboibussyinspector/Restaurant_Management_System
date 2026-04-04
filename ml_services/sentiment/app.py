from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Sentiment Analysis")

class Feedback(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"msg": "Sentiment Analysis Ready"}

@app.post("/analyze")
def analyze(feedback: Feedback):
    # Placeholder
    return {"sentiment": "positive" if "good" in feedback.text.lower() else "negative"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)

