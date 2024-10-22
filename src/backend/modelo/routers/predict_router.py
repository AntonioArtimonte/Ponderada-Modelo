from fastapi import APIRouter, HTTPException
from typing import Optional, Dict
from pydantic import BaseModel
from datetime import datetime
from models.model_controller import ModelController

router = APIRouter()

controller = ModelController()

# Modelos tipados
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

class CryptosResponse(BaseModel):
    cryptos: Optional[Dict[str, int]] = None

class TestResponse(BaseModel):
    crypto: str
    date: str
    actual_price: float
    predicted_price: float

class RetrainResponse(BaseModel):
    test_loss: Optional[float] = None
    test_mae: Optional[float] = None
    message: str

# Endpoint treino modelo
@router.post("/train", response_model=TrainResponse)
async def train(request: TrainRequest):
    try:
        result = controller.train(request.crypto, request.start_date, request.end_date)
        print(result)

        return TrainResponse(test_loss=result.get("test_loss"), test_mae=result.get("test_mae"), message=result.get("message", "Model trained successfully"))
    except ValueError as e:
        return TrainResponse(message=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Endpoint retreino modelo
@router.post("/retrain", response_model=RetrainResponse)
async def retrain(request: TrainRequest):
    try:
        result = controller.train(request.crypto, request.start_date, request.end_date, overwrite=True)

        return RetrainResponse(
            test_loss=result.get("test_loss"),
            test_mae=result.get("test_mae"),
            message="Model retrained successfully."
        )
    
    except ValueError as e:
        return RetrainResponse(message=str(e))
    except Exception as e:
        return RetrainResponse(message=str(e))

# Endpoint predizer valor da criptomoeda
@router.post("/predict/{crypto}", response_model=PredictResponse)
async def predict(crypto: str):

    try:
        predictions = controller.predict(steps=7, crypto=crypto)
        print(predictions)
        print("antes do crypto")
        
        predictions = [float(p) for p in predictions]

        return PredictResponse(prediction=predictions, crypto=crypto)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trained", response_model=TrainedResponse)
async def trained():
    try:
        crypto = controller.get_trained_crypto()

        return TrainedResponse(crypto=crypto)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/cryptos", response_model=CryptosResponse)
async def cryptos():
    try:
        cryptos = controller.get_all_cryptos()

        return CryptosResponse(cryptos=cryptos)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/test/{crypto}", response_model=TestResponse)
async def test_crypto(crypto: str):
    result = controller.test_crypto(crypto)
    return TestResponse(
        crypto=result["crypto"],
        date=result["date"],
        actual_price=result["actual_price"],
        predicted_price=result["predicted_price"]
    )