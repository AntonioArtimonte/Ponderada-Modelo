import yfinance as yf
import pandas as pd
import numpy as np
import json
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import EarlyStopping
from datetime import datetime

# JSON file to store trained crypto status and model information
TRAINED_CRYPTOS_FILE = "trained_cryptos.json"

class CryptoPredictor:
    def __init__(self, seq_length=60, model_path="latest_crypto_model.h5"):
        self.seq_length = seq_length
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        self.model = None
        self.model_path = model_path

    def load_data(self, crypto: str, start_date: str, end_date: str):
        # Ensure date is formatted as 'YYYY-MM-DD'
        try:
            # Parse and reformat dates if necessary
            start_date = datetime.strptime(start_date, "%Y-%m-%d").strftime("%Y-%m-%d")
            end_date = datetime.strptime(end_date, "%Y-%m-%d").strftime("%Y-%m-%d")
        except ValueError as e:
            raise ValueError(f"Invalid date format: {str(e)}")

        # Fetch data from Yahoo Finance with correct date format
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

    def train_model(self, X_train, y_train, X_test, y_test, crypto, epochs=20, batch_size=32):
        """Train the model and save it, but only if it hasn't been trained yet."""
        
        # Check if the model is already trained
        trained_cryptos = self.load_trained_cryptos()
        if crypto in trained_cryptos and trained_cryptos[crypto]["trained"] == 1:
            raise ValueError(f"Model for {crypto} is already trained.")

        # Proceed with training if not already trained
        early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
        history = self.model.fit(X_train, y_train, epochs=epochs, batch_size=batch_size, validation_data=(X_test, y_test), callbacks=[early_stopping])
        test_loss, test_mae = self.model.evaluate(X_test, y_test)

        # Save the model and update the JSON file
        self.save_model(crypto)
        return test_loss, test_mae


    def save_model(self, crypto: str):
        '''
        Save the trained model and update the trained cryptocurrency in the JSON file.
        '''
        # Save the trained model
        self.model.save(self.model_path)

        # Load the current trained cryptos from JSON
        trained_cryptos = self.load_trained_cryptos()

        # Mark all previously trained cryptos as untrained
        for key in trained_cryptos:
            trained_cryptos[key]["trained"] = 0

        # Update the trained status for the current crypto
        trained_cryptos[crypto] = {"trained": 1, "model_path": self.model_path}

        # Save the updated trained cryptos to JSON
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

    def load_model(self):
        '''
        Load the latest trained model from the JSON file.
        '''
        trained_cryptos = self.load_trained_cryptos()
        latest_trained_crypto = None
        for crypto, status in trained_cryptos.items():
            if status["trained"] == 1:
                latest_trained_crypto = crypto
                model_path = status["model_path"]
                self.model = tf.keras.models.load_model(model_path)
                return latest_trained_crypto
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
        Check if there are any trained models and return the name of the trained cryptocurrency.
        '''
        trained_cryptos = self.load_trained_cryptos()
        
        for crypto, status in trained_cryptos.items():
            if status["trained"] == 1:
                return crypto  # Return the name of the trained crypto
        
        return None  # Return None if no crypto is trained