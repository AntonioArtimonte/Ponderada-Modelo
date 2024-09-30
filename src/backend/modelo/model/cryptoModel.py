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
        '''
        Método para carregar os dados de uma criptomoeda específica.
        crypto: str - Nome da criptomoeda.
        start_date: str - Data de início para carregar os dados.
        end_date: str - Data de fim para carregar os dados.
        '''

        try:
            start_date = datetime.strptime(start_date, "%Y-%m-%d").strftime("%Y-%m-%d")
            end_date = datetime.strptime(end_date, "%Y-%m-%d").strftime("%Y-%m-%d")
        except ValueError as e:
            raise ValueError(f"Invalid date format: {str(e)}")

        df = yf.download(crypto, start=start_date, end=end_date)
        
        if df.empty:
            raise ValueError(f"No data found for {crypto} from {start_date} to {end_date}")
        
        df = df[['Open', 'High', 'Low', 'Close', 'Volume']] 
        scaled_data = self.scaler.fit_transform(df['Close'].values.reshape(-1, 1))
        return scaled_data

    def create_sequences(self, data):
        '''
        Método para criar sequências de dados para treinamento.
        data: np.array - Dados a serem transformados em sequências.
        '''
        X, y = [], []
        for i in range(self.seq_length, len(data)):
            X.append(data[i - self.seq_length:i, 0])
            y.append(data[i, 0])
        return np.array(X), np.array(y)

    def build_model(self, input_shape):
        '''
        Método para construir o modelo LSTM com camada de atenção.
        input_shape: tuple - Formato da entrada do modelo.
        '''
        inputs = layers.Input(shape=input_shape)
        lstm_out = layers.LSTM(128, return_sequences=True)(inputs)
        attention_out = self.attention_block(lstm_out)
        combined_out = layers.Flatten()(attention_out)
        dense_out = layers.Dense(64, activation='relu')(combined_out)
        output = layers.Dense(1, activation='linear')(dense_out)
        self.model = models.Model(inputs=inputs, outputs=output)
        self.model.compile(optimizer='adam', loss='mean_squared_error', metrics=['mae'])

    def attention_block(self, inputs):
        '''
        Método para adicionar a camada de atenção ao modelo.
        inputs: tensor - Entrada para a camada de atenção.
        '''
        attention_weights = layers.Dense(1, activation='tanh')(inputs)
        attention_weights = layers.Flatten()(attention_weights)
        attention_weights = layers.Activation('softmax')(attention_weights)
        attention_weights = layers.RepeatVector(128)(attention_weights)
        attention_weights = layers.Permute([2, 1])(attention_weights)
        weighted_inputs = layers.Multiply()([inputs, attention_weights])
        return weighted_inputs

    def train_model(self, X_train, y_train, X_test, y_test, crypto: str, epochs: int=20, batch_size: int=32, overwrite: bool = False):
        '''
        Método para treinar o modelo com os dados de treinamento e teste.

        X_train: np.array - Dados de treinamento.
        y_train: np.array - Rótulos de treinamento.
        X_test: np.array - Dados de teste.
        y_test: np.array - Rótulos de teste.
        crypto: str - Nome da criptomoeda.
        epochs: int - Número de épocas para treinamento.
        batch_size: int - Tamanho do lote para treinamento.
        overwrite: bool - Flag que determina se o modelo deve ser "overwrited"
        '''        
        trained_cryptos = self.load_trained_cryptos()
        if crypto in trained_cryptos and trained_cryptos[crypto]["trained"] == 1 and not overwrite:
            raise ValueError(f"Model for {crypto} is already trained.")

        early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
        history = self.model.fit(
            X_train, y_train, 
            epochs=epochs, 
            batch_size=batch_size, 
            validation_data=(X_test, y_test), 
            callbacks=[early_stopping]
        )
        test_loss, test_mae = self.model.evaluate(X_test, y_test)

        print("treino e vai salvar")
        self.save_model(crypto, overwrite=overwrite)
        return test_loss, test_mae


    def save_model(self, crypto: str, overwrite: bool = False):
        '''
        Salva o modelo treinado no arquivo JSON.

        crypto: str - Nome da criptomoeda.
        overwrite: bool - Flag que determina se modelo deve ser "overwrited"
        '''
        model_filename = f"{crypto}-model.h5"
        model_path = os.path.join('.', model_filename)
        
        self.model.save(model_path)

        trained_cryptos = self.load_trained_cryptos()

        if overwrite:
            trained_cryptos["models"] = [m for m in trained_cryptos.get("models", []) if m != model_filename]
        else:
            print("to no else filhao")
            if "models" not in trained_cryptos:
                trained_cryptos["models"] = []

            trained_cryptos["models"].append(model_filename)

            # Corrected parentheses placement
            if len(trained_cryptos["models"]) > MAX_MODELS:
                oldest_model = trained_cryptos["models"].pop(0)
                
                for crypto_name, crypto_info in trained_cryptos.items():
                    if isinstance(crypto_info, dict) and crypto_info.get("model_path") == os.path.join('.', oldest_model):
                        trained_cryptos[crypto_name]["trained"] = 0
                        break

        print("Fudeu aqui")

        trained_cryptos[crypto] = {"trained": 1, "model_path": model_path}

        with open(TRAINED_CRYPTOS_FILE, 'w') as file:
            json.dump(trained_cryptos, file, indent=4)



    def load_trained_cryptos(self):
        '''
        Carrega o arquivo JSON que contém os modelos treinados.

        '''
        try:
            with open(TRAINED_CRYPTOS_FILE, 'r') as file:
                return json.load(file)
        except FileNotFoundError:
            return {}

    def load_model(self, crypto: str):
        '''
        Carrega o modelo treinado para a criptomoeda especificada.
        crypto: str - Nome da criptomoeda.
        '''
        trained_cryptos = self.load_trained_cryptos()

        if crypto in trained_cryptos and trained_cryptos[crypto]["trained"] == 1:
            model_path = trained_cryptos[crypto]["model_path"]
            self.model = tf.keras.models.load_model(model_path)
            return crypto

        return None 


    def predict_future_prices(self, data, steps):
        '''
        Prediz os preços futuros da criptomoeda.
        data: np.array - Dados históricos da criptomoeda.
        steps: int - Número de dias futuros a serem pred
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
        Checa se a criptomoeda está treinada.
        '''
        trained_cryptos = self.load_trained_cryptos()

        cryptos = [crypto for crypto, status in trained_cryptos.items() if status["trained"] == 1]

        if cryptos:
            return "; ".join(cryptos) 
        return None 
    
    def get_all_cryptos(self):
        '''
        Pega todas as criptomoedas do JSON.
        '''

        trained_cryptos = self.load_trained_cryptos()
        return trained_cryptos
    
    def test_crypto(self, crypto: str):
        '''
        Testa a criptomoeda especificada.
        crypto: str - Nome da criptomoeda.
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
