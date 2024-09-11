package models

import (
	"time"
	
	"go.mongodb.org/mongo-driver/bson/primitive"
	)

// Modelo da "base de dados"
type DBModel struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	Crypto      string             `bson:"crypto"`
	Predictions []float64          `bson:"predictions"`
	Timestamp   time.Time          `bson:"timestamp"`
}

// DB represents the response structure for the client
type DB struct {
	ID          string    `json:"id"`
	Crypto      string    `json:"crypto"`
	Predictions []float64 `json:"predictions"`
	Timestamp   time.Time `json:"timestamp"`
}

// CreateDB represents the request structure to insert into the database
type CreateDB struct {
	Crypto      string    `json:"crypto"`
	Predictions []float64 `json:"predictions"`
	Timestamp   time.Time `json:"timestamp"`
}

// UpdateDB represents the request structure to update an existing record
type UpdateDB struct {
	Crypto      string    `json:"crypto"`
	Predictions []float64 `json:"predictions"`
	Timestamp   time.Time `json:"timestamp"`
}


type TrainRequest struct {
    Crypto    string `json:"crypto"`
    StartDate string `json:"start_date"`  
    EndDate   string `json:"end_date"`    
}

type TrainResponse struct {
	Message   string  `json:"message"`
	TestLoss  *float64 `json:"test_loss"`
	TestMae   *float64 `json:"test_mae"`
}

type PredictResponse struct {
	Prediction []float64 `json:"prediction"`
	Crypto string `json:"crypto"`
}

type TrainedResp struct {
	Crypto string `json:"crypto"`
}

type AllCryptos struct {
    Cryptos map[string]int `json:"cryptos"` 
}