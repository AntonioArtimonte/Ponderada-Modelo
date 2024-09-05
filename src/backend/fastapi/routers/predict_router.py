from fastapi import APIRouter, HTTPException
import json
from pydantic import BaseModel
from fastapi.models.model_controller import train_model, get_latest_trained_crypto, predict_crypto

router = APIRouter()

class TrainRequest(BaseModel):
    crypto: str
    start_date: str
    end_date: str

class PredictRequest(BaseModel):
    data: list

class TrainResponse(BaseModel):
    message: str

class PredictResponse(BaseModel):
    prediction: list

TRAINED_CRYPTOS = "trained_cryptos.json"

def load_trained_cryptos():
    try:
        with open(TRAINED_CRYPTOS, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return {}

def save_trained_cryptos(data):
    with open(TRAINED_CRYPTOS, 'w') as file:
        json.dump(data, file, indent=4)

@router.post("/train", response_model=TrainResponse)
async def train(request: TrainRequest):
    try:
        trained_cryptos = load_trained_cryptos()

        for crypto in trained_cryptos:
            trained_cryptos[crypto]['trained'] = 0
        
        train_model(request.crypto, request.start_date, request.end_date)

        trained_cryptos[request.crypto] = {"trained": 1}

        save_trained_cryptos(trained_cryptos)

        return TrainResponse(message=f"Model trained on {request.crypto} from {request.start_date} to {request.end_date} successfully")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/predict")
async def get_trained_cryptos():
    trained_cryptos = load_trained_cryptos()
    if not trained_cryptos:
        raise HTTPException(status_code=404, detail="No trained cryptos found")
    return trained_cryptos

@router.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    trained_cryptos = load_trained_cryptos()

    latest_trained_crypto = None

    for crypto, status in trained_cryptos.items():
        if status['trained'] == 1:
            latest_trained_crypto = crypto
            break
    
    if not latest_trained_crypto:
        raise HTTPException(status_code=404, detail="No trained cryptos found")
    
    prediction = predict_crypto(request.data)
    return PredictResponse(prediction=prediction)