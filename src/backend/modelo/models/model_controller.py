from model.cryptoModel import CryptoPredictor
from datetime import datetime

class ModelController:
    def __init__(self):
        self.predictor = CryptoPredictor()

    def train(self, crypto: str, start_date: str, end_date: str):
        scaled_data = self.predictor.load_data(crypto, start_date, end_date)
        X, y = self.predictor.create_sequences(scaled_data)
        X = X.reshape((X.shape[0], X.shape[1], 1))
        
        split = int(0.8 * len(X))
        X_train, X_test = X[:split], X[split:]
        y_train, y_test = y[:split], y[split:]

        self.predictor.build_model((X_train.shape[1], 1))
        test_loss, test_mae = self.predictor.train_model(X_train, y_train, X_test, y_test, crypto)

        return {"test_loss": test_loss, "test_mae": test_mae}

    def predict(self, steps: int, crypto: str):
        print("entrou na função")
        latest_crypto = self.predictor.load_model(crypto)
        print(latest_crypto)
        today = datetime.today().strftime('%Y-%m-%d')

        if not latest_crypto or latest_crypto == None:
            raise ValueError("The model {crypto} has not been trained yet.")

        scaled_data = self.predictor.load_data(latest_crypto, '2020-01-01', today)

        predictions = self.predictor.predict_future_prices(scaled_data, steps)

        return predictions
    
    def get_trained_crypto(self, crypto: str):
        print("daora em")

        trained_crypto = self.predictor.check_trained()

        if trained_crypto:
            trained_crypto = trained_crypto.split("; ")

        if crypto in trained_crypto:
            return crypto
    
        return None
    
    def get_all_cryptos(self):
        raw_cryptos_data = self.predictor.load_trained_cryptos()  

        print(raw_cryptos_data) 

        processed_data = {crypto: info['trained'] for crypto, info in raw_cryptos_data.items() if crypto != "models"}

        return processed_data

    
    def test_crypto(self, crypto: str):
        '''
        Compare the actual price of yesterday with the predicted price.
        '''
        result = self.predictor.test_crypto(crypto)
        return {
            "crypto": crypto,
            "date": result['date'],
            "actual_price": result['actual_price'],
            "predicted_price": result['predicted_price']
        }

