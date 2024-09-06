from fastapi import APIRouter, HTTPException
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from models.model_controller import ModelController

router = APIRouter()

# Instantiate the controller
controller = ModelController()

# Request and Response Models
class TrainRequest(BaseModel):
    crypto: str
    start_date: str
    end_date: str

class TrainResponse(BaseModel):
    test_loss: Optional[float] = None
    test_mae: Optional[float] = None
    message: str

class PredictResponse(BaseModel):
    crypto: str
    prediction: list

class TrainedResponse(BaseModel):
    crypto: Optional[str] = None

# Endpoint to train the model on a specific cryptocurrency
@router.post("/train", response_model=TrainResponse)
async def train(request: TrainRequest):
    try:
        # Call the controller to handle training
        result = controller.train(request.crypto, request.start_date, request.end_date)

        return TrainResponse(test_loss=result.get("test_loss"), test_mae=result.get("test_mae"), message=result.get("message", "Model trained successfully"))
    except ValueError as e:
        # If the model is already trained, return a message without training again
        return TrainResponse(message=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint to predict cryptocurrency price
@router.post("/predict", response_model=PredictResponse)
async def predict():
    try:
        # Call the controller to handle prediction (7-day prediction)
        predictions = controller.predict(steps=7)
        
        crypto = controller.get_trained_crypto()
        
        # Convert numpy.float32 to standard Python float
        predictions = [float(p) for p in predictions]

        return PredictResponse(prediction=predictions, crypto=crypto)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trained", response_model=TrainedResponse)
async def trained():
    try:
        # Call the controller to get the latest trained crypto
        crypto = controller.get_trained_crypto()

        return TrainedResponse(crypto=crypto)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))