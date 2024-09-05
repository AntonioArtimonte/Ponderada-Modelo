package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type DBModel struct {
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	Date       string             `bson:"date"`
	StartValue int                `bson:"startValue"`
	EndValue   int                `bson:"endValue"`
	Model      string             `bson:"model"`
}

type DB struct {
	ID         string `json:"id"`
	Date       string `json:"date"`
	StartValue int    `json:"startValue"`
	EndValue   int    `json:"endValue"`
	Model      string `json:"model"`
}

type CreateDB struct {
	Date       string `json:"date"`
	StartValue int    `json:"startValue"`
	EndValue   int    `json:"endValue"`
	Model      string `json:"model"`
}

type UpdateDB struct {
	StartValue int    `json:"startValue"`
	EndValue   int    `json:"endValue"`
	Model      string `json:"model"`
}

type TrainRequest struct {
	Crypto string `json:"crypto"`
	StartDate string `json:"startDate"`
	EndDate string `json:"endDate"`
}

type TrainResponse struct {
	Message string `json:"message"`
}

type PredictRequest struct {
	Data []float64 `json:"data"`
}

type PredictResponse struct {
	Prediction []float64 `json:"prediction"`
}