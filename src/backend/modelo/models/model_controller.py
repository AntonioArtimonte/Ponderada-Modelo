from model.cryptoModel import CryptoPredictor
from datetime import datetime

class ModelController:
    def __init__(self):
        self.predictor = CryptoPredictor()

    def train(self, crypto: str, start_date: str, end_date: str):
        # Load and preprocess the data
        scaled_data = self.predictor.load_data(crypto, start_date, end_date)
        X, y = self.predictor.create_sequences(scaled_data)
        X = X.reshape((X.shape[0], X.shape[1], 1))
        
        # Split the data
        split = int(0.8 * len(X))
        X_train, X_test = X[:split], X[split:]
        y_train, y_test = y[:split], y[split:]

        # Build and train the model
        self.predictor.build_model((X_train.shape[1], 1))
        test_loss, test_mae = self.predictor.train_model(X_train, y_train, X_test, y_test, crypto)

        return {"test_loss": test_loss, "test_mae": test_mae}

    def predict(self, steps: int):
        # Load the latest trained model
        latest_crypto = self.predictor.load_model()
        today = datetime.today().strftime('%Y-%m-%d')

        if not latest_crypto:
            raise ValueError("No model has been trained yet.")

        # Load the data for the latest trained crypto
        scaled_data = self.predictor.load_data(latest_crypto, '2020-01-01', today)

        # Predict future prices
        predictions = self.predictor.predict_future_prices(scaled_data, steps)

        return predictions
    
    def get_trained_crypto(self):
        print("chegou aqui")
        return self.predictor.check_trained()
    
    def get_all_cryptos(self):
        raw_cryptos_data = self.predictor.get_all_cryptos()

        print(raw_cryptos_data)  # Debug: Print the raw data

        # Process the data to only return the 'trained' status
        processed_data = {crypto: info['trained'] for crypto, info in raw_cryptos_data.items()}

        # Return the processed data
        return processed_data
