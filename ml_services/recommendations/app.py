from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="Menu Recommendations ML")

class OrderHistory(BaseModel):
    items: list
    customer_id: int

@app.get("/")
def read_root():
    return {"msg": "Recommendations ML Service"}

@app.post("/recommend")
def recommend(history: OrderHistory):
    # Placeholder ML logic
    return {"suggested_items": ["Pasta", "Salad"]}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)

