from model.cryptoModel import CryptoPredictor
from datetime import datetime

class ModelController:
    def __init__(self):
        self.predictor = CryptoPredictor()

    def train(self, crypto: str, start_date: str, end_date: str, overwrite: bool = False):
        '''
        Treina o modelo para a criptomoeda especificada.

        crypto: str - Nome da criptomoeda.
        start_date: str - Data de início para treinamento.
        end_date: str - Data de fim para treinamento.
        overwrite: bool - Flag que determina se o modelo existente deveria ser "overwrited"
        '''
        scaled_data = self.predictor.load_data(crypto, start_date, end_date)
        X, y = self.predictor.create_sequences(scaled_data)
        X = X.reshape((X.shape[0], X.shape[1], 1))
        
        split = int(0.8 * len(X))
        X_train, X_test = X[:split], X[split:]
        y_train, y_test = y[:split], y[split:]

        self.predictor.build_model((X_train.shape[1], 1))
        test_loss, test_mae = self.predictor.train_model(X_train, y_train, X_test, y_test, crypto, overwrite=overwrite)

        return {"test_loss": test_loss, "test_mae": test_mae}

    def predict(self, steps: int, crypto: str):
        '''
        Prediz o valor futuro da criptomoeda especificada.
        steps: int - Número de dias futuros a serem preditos.
        crypto: str - Nome da criptomoeda.
        '''
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
        '''
        Pega a lista de todas as criptomoedas treinadas e verifica se a criptomoeda especificada está na lista.
        crypto: str - Nome da criptomoeda.
        '''
        trained_crypto = self.predictor.check_trained()

        if trained_crypto:
            trained_crypto = trained_crypto.split("; ")

        if crypto in trained_crypto:
            return crypto
    
        return None
    
    def get_all_cryptos(self):
        '''
        Pega a lista de todas as criptomoedas treinadas.
        '''
        raw_cryptos_data = self.predictor.load_trained_cryptos()  

        print(raw_cryptos_data) 

        processed_data = {crypto: info['trained'] for crypto, info in raw_cryptos_data.items() if crypto != "models"}

        return processed_data

    
    def test_crypto(self, crypto: str):
        '''
        Compara o preço atual da criptomoeda com o preço predito.
        crypto: str - Nome da criptomoeda.
        '''
        result = self.predictor.test_crypto(crypto)
        return {
            "crypto": crypto,
            "date": result['date'],
            "actual_price": result['actual_price'],
            "predicted_price": result['predicted_price']
        }

