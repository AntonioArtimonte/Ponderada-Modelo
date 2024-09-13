import yfinance as yf
import pandas as pd
import numpy as np
import json
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import EarlyStopping
from datetime import datetime, timedelta

import os

# Obs: Esse código está uma bizarrice, não pergunte como funciona eu sei no dia 12/09/2024, depois disso não vou saber mais nada mas a classe ficou daora

# JSON QUE GUARDA OS CRYPTOS TREINADOS
TRAINED_CRYPTOS_FILE = "trained_cryptos.json"

MAX_MODELS = 5  # PODE MUDAR, NÚMERO MÁXIMO DE MODELOS QUE VOCÊ DESEJA GUARDAR

# TODO: DEIXAR MAX_MODELS COMO .ENV

class CryptoPredictor:
    def __init__(self, seq_length=60):
        self.seq_length = seq_length
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        self.model = None

    def load_data(self, crypto: str, start_date: str, end_date: str):

        try:
            start_date = datetime.strptime(start_date, "%Y-%m-%d").strftime("%Y-%m-%d")
            end_date = datetime.strptime(end_date, "%Y-%m-%d").strftime("%Y-%m-%d")
        except ValueError as e:
            raise ValueError(f"Invalid date format: {str(e)}")

        df = yf.download(crypto, start=start_date, end=end_date)
        
        if df.empty:
            raise ValueError(f"No data found for {crypto} from {start_date} to {end_date}")
        
        df = df[['Open', 'High', 'Low', 'Close', 'Volume']]  # Selected columns
        scaled_data = self.scaler.fit_transform(df['Close'].values.reshape(-1, 1))
        return scaled_data

    def create_sequences(self, data):
        X, y = [], []
        for i in range(self.seq_length, len(data)):
            X.append(data[i - self.seq_length:i, 0])
            y.append(data[i, 0])
        return np.array(X), np.array(y)

    def build_model(self, input_shape):
        inputs = layers.Input(shape=input_shape)
        lstm_out = layers.LSTM(128, return_sequences=True)(inputs)
        attention_out = self.attention_block(lstm_out)
        combined_out = layers.Flatten()(attention_out)
        dense_out = layers.Dense(64, activation='relu')(combined_out)
        output = layers.Dense(1, activation='linear')(dense_out)
        self.model = models.Model(inputs=inputs, outputs=output)
        self.model.compile(optimizer='adam', loss='mean_squared_error', metrics=['mae'])

    def attention_block(self, inputs):
        attention_weights = layers.Dense(1, activation='tanh')(inputs)
        attention_weights = layers.Flatten()(attention_weights)
        attention_weights = layers.Activation('softmax')(attention_weights)
        attention_weights = layers.RepeatVector(128)(attention_weights)
        attention_weights = layers.Permute([2, 1])(attention_weights)
        weighted_inputs = layers.Multiply()([inputs, attention_weights])
        return weighted_inputs

    def train_model(self, X_train, y_train, X_test, y_test, crypto: str, epochs: int=20, batch_size: int=32):
        """Treina e salva o modelo se o mesmo ainda não foi treinado."""
        
        trained_cryptos = self.load_trained_cryptos()
        if crypto in trained_cryptos and trained_cryptos[crypto]["trained"] == 1:
            raise ValueError(f"Model for {crypto} is already trained.")

        early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
        history = self.model.fit(X_train, y_train, epochs=epochs, batch_size=batch_size, validation_data=(X_test, y_test), callbacks=[early_stopping])
        test_loss, test_mae = self.model.evaluate(X_test, y_test)

        self.save_model(crypto)
        return test_loss, test_mae


    def save_model(self, crypto: str):
        '''
        Save the trained model and manage the last 5 trained models. 
        The oldest model will still be kept in the JSON, but its trained status will be set to 0.
        '''
        model_filename = f"{crypto}-model.h5"
        model_path = os.path.join('.', model_filename)
        
        self.model.save(model_path)

        trained_cryptos = self.load_trained_cryptos()

        if "models" not in trained_cryptos:
            trained_cryptos["models"] = []
        
        trained_cryptos["models"].append(model_filename)

        if len(trained_cryptos["models"]) > MAX_MODELS:
            oldest_model = trained_cryptos["models"][0] 

            for crypto_name, crypto_info in trained_cryptos.items():
                if isinstance(crypto_info, dict) and crypto_info.get("model_path") == os.path.join('.', oldest_model):
                    trained_cryptos[crypto_name]["trained"] = 0
                    break
            
            trained_cryptos["models"].pop(0)

        trained_cryptos[crypto] = {"trained": 1, "model_path": model_path}

        with open(TRAINED_CRYPTOS_FILE, 'w') as file:
            json.dump(trained_cryptos, file, indent=4)



    def load_trained_cryptos(self):
        '''
        Load the JSON file containing the trained cryptos.
        '''
        try:
            with open(TRAINED_CRYPTOS_FILE, 'r') as file:
                return json.load(file)
        except FileNotFoundError:
            return {}

    def load_model(self, crypto: str):
        '''
        Load the trained model for the specified cryptocurrency from the JSON file.
        '''
        trained_cryptos = self.load_trained_cryptos()

        if crypto in trained_cryptos and trained_cryptos[crypto]["trained"] == 1:
            model_path = trained_cryptos[crypto]["model_path"]
            self.model = tf.keras.models.load_model(model_path)
            return crypto

        return None 


    def predict_future_prices(self, data, steps):
        '''
        Predict future prices based on the loaded model and data.
        '''
        current_sequence = data[-self.seq_length:]
        future_predictions = []
        for _ in range(steps):
            current_sequence_reshaped = current_sequence.reshape((1, self.seq_length, 1))
            predicted_price_scaled = self.model.predict(current_sequence_reshaped)
            predicted_price = self.scaler.inverse_transform(predicted_price_scaled)[0][0]
            future_predictions.append(predicted_price)
            predicted_price_scaled = np.array(predicted_price_scaled).reshape((1, 1))
            current_sequence = np.append(current_sequence, predicted_price_scaled)[-self.seq_length:]
        return future_predictions

        
    def check_trained(self):
        '''
        Check if there are any trained models and return the names of all trained cryptocurrencies as a comma-separated string.
        '''
        trained_cryptos = self.load_trained_cryptos()

        cryptos = [crypto for crypto, status in trained_cryptos.items() if status["trained"] == 1]

        if cryptos:
            return "; ".join(cryptos) 
        return None 
    
    def get_all_cryptos(self):
        '''
        Get all the cryptocurrencies from the JSON, with the status 0-1 according to what's in the JSON.
        '''

        trained_cryptos = self.load_trained_cryptos()
        return trained_cryptos
    
    def test_crypto(self, crypto: str):
        '''
        Fetch the actual price for 2 days ago and compare it with the predicted price.
        If no data is available for that day, handle the case gracefully.
        '''
        today = datetime.today()
        two_days_ago = today - timedelta(days=2)

        two_days_ago_str = two_days_ago.strftime('%Y-%m-%d')

        actual_data = yf.download(str(crypto), start="2024-09-01", end=two_days_ago_str)

        if actual_data.empty:
            return {
                "message": f"No data found for {crypto} on {two_days_ago_str}",
                "date": two_days_ago_str
            }

        actual_price = actual_data['Close'].values[-1]

        self.load_model(crypto)  
        historical_data = self.load_data(crypto, start_date='2021-01-01', end_date=two_days_ago_str)

        predictions = self.predict_future_prices(historical_data, steps=1)
        predicted_price = predictions[0]

        return {
            "actual_price": actual_price,
            "predicted_price": predicted_price,
            "date": two_days_ago_str
        }
