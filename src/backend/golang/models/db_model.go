package models

import (
	"time"
	
	"go.mongodb.org/mongo-driver/bson/primitive"
	)

// Modelo da "base de dados"
type LogEntry struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Time           time.Time          `bson:"time" json:"time"`
	RequestType    string             `bson:"request_type" json:"request_type"`
	StatusCode     int                `bson:"status_code" json:"status_code"`
	CompletionTime time.Duration      `bson:"completion_time" json:"completion_time"`
	CryptoName     string             `bson:"crypto_name" json:"crypto_name"`
}


// Resposta do cliente
type DB struct {
	ID          string    `json:"id"`
	Crypto      string    `json:"crypto"`
	Predictions []float64 `json:"predictions"`
	Timestamp   time.Time `json:"timestamp"`
}

// Request que insere na DB
type CreateDB struct {
	Crypto      string    `json:"crypto"`
	Predictions []float64 `json:"predictions"`
	Timestamp   time.Time `json:"timestamp"`
}

// Atualiza a DB
type UpdateDB struct {
	Crypto      string    `json:"crypto"`
	Predictions []float64 `json:"predictions"`
	Timestamp   time.Time `json:"timestamp"`
}

// Tipo de um modelo de request para treino
type TrainRequest struct {
    Crypto    string `json:"crypto"`
    StartDate string `json:"start_date"`  
    EndDate   string `json:"end_date"`    
	Overwrite bool `json:"overwrite,omitempty`
}

// Tipo de um modelo de resposta para treino
type TrainResponse struct {
	Message   string  `json:"message"`
	TestLoss  *float64 `json:"test_loss"`
	TestMae   *float64 `json:"test_mae"`
}

// Tipo de um modelo de request para predict
type PredictResponse struct {
	Prediction []float64 `json:"prediction"`
	Crypto string `json:"crypto"`
}

// Tipo de um modelo de request para treinado
type TrainedResp struct {
	Crypto string `json:"crypto"`
}

// Tipo de modelo para todas as cryptos
type AllCryptos struct {
    Cryptos map[string]int `json:"cryptos"` 
}

// Tipo de modelo para testar a predição
type TestPredicted struct {
	Crypto string `json:"crypto"`
	Date string `json:"date"`
	ActualPrice float64 `json:"actual_price"`
	PredictedPrice float64 `json:"predicted_price"`
}