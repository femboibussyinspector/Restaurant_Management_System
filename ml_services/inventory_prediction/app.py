from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Inventory Prediction")

class SalesData(BaseModel):
    dates: list
    quantities: list

@app.get("/")
def read_root():
    return {"msg": "Inventory Prediction Ready"}

@app.post("/predict")
def predict(data: SalesData):
    # Placeholder
    return {"predicted_next": sum(data.quantities)/len(data.quantities) * 1.1}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)

