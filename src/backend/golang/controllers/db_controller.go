package controllers

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/thedevsaddam/renderer"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/AntonioArtimonte/Ponderada-Modelo/config"
	"github.com/AntonioArtimonte/Ponderada-Modelo/models"
	"github.com/AntonioArtimonte/Ponderada-Modelo/utils"
)

var rnd *renderer.Render = renderer.New()

// TODO: Arrumar o error aqui (Falta implementar)

func logRequest(requestType string, statusCode int, completionTime time.Duration, cryptoName string, err error) {
	logEntry := models.LogEntry{
		ID:             primitive.NewObjectID(),
		Time:           time.Now(),
		RequestType:    requestType,
		StatusCode:     statusCode,
		CompletionTime: completionTime,
		CryptoName:     cryptoName,
	}



	_, insertErr := config.Db.Collection("logs").InsertOne(context.TODO(), logEntry)
	if insertErr != nil {
		log.Printf("Error inserting log entry into MongoDB: %v\n", insertErr)
	}
}

// GetDB pega todas as logs do DB
func GetDB(w http.ResponseWriter, r *http.Request) {
	var logs []models.LogEntry
	filter := bson.D{}

	cursor, err := config.Db.Collection("logs").Find(context.Background(), filter)
	if err != nil {
		utils.CheckError(err)
		rnd.JSON(w, http.StatusInternalServerError, renderer.M{
			"message": "Failed to retrieve logs",
			"error":   err.Error(),
		})
		return
	}
	defer cursor.Close(context.Background())

	if err = cursor.All(context.Background(), &logs); err != nil {
		utils.CheckError(err)
		rnd.JSON(w, http.StatusInternalServerError, renderer.M{
			"message": "Failed to parse logs",
			"error":   err.Error(),
		})
		return
	}

	rnd.JSON(w, http.StatusOK, renderer.M{
		"message": "All logs retrieved",
		"data":    logs,
	})
}

// Treina o modelo
func TrainModel(w http.ResponseWriter, r *http.Request) {
	startTime := time.Now()

	var request models.TrainRequest
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		logRequest("train", http.StatusBadRequest, time.Since(startTime), "", err)
		return
	}

	jsonData, err := json.Marshal(request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		logRequest("train", http.StatusBadRequest, time.Since(startTime), "", err)
		return
	}
	resp, err := http.Post("http://backend-model:8000/train", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		logRequest("train", http.StatusInternalServerError, time.Since(startTime), "", err)
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		logRequest("train", http.StatusInternalServerError, time.Since(startTime), "", err)
		return
	}

	var trainResp models.TrainResponse
	err = json.Unmarshal(body, &trainResp)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		logRequest("train", http.StatusInternalServerError, time.Since(startTime), "", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(trainResp)

	logRequest("train", http.StatusOK, time.Since(startTime), "", nil)
}

// PredictCrypto faz a predição do modelo
func PredictCrypto(w http.ResponseWriter, r *http.Request) {
	startTime := time.Now()

	crypto := r.URL.Query().Get("crypto")
	crypto = strings.TrimSpace(crypto)

	if crypto == "" {
		http.Error(w, "Missing crypto parameter", http.StatusBadRequest)
		logRequest("predict", http.StatusBadRequest, time.Since(startTime), "", nil)
		return
	}

	backendURL := "http://backend-model:8000/predict/" + crypto

	resp, err := http.Post(backendURL, "application/json", nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		logRequest("predict", http.StatusInternalServerError, time.Since(startTime), crypto, err)
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		logRequest("predict", http.StatusInternalServerError, time.Since(startTime), crypto, err)
		return
	}

	var predictResp models.PredictResponse
	err = json.Unmarshal(body, &predictResp)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		logRequest("predict", http.StatusInternalServerError, time.Since(startTime), crypto, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(predictResp)

	logRequest("predict", http.StatusOK, time.Since(startTime), crypto, nil)
}

// Pega a lista de cryptomoedas treinadas
func TrainedCrypto(w http.ResponseWriter, r *http.Request) {
	startTime := time.Now()

	resp, err := http.Get("http://backend-model:8000/trained")
	if err != nil {
		utils.CheckError(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		logRequest("trained", http.StatusInternalServerError, time.Since(startTime), "", err)
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		utils.CheckError(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		logRequest("trained", http.StatusInternalServerError, time.Since(startTime), "", err)
		return
	}

	var trainedResp models.TrainedResp
	err = json.Unmarshal(body, &trainedResp)
	if err != nil {
		utils.CheckError(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		logRequest("trained", http.StatusInternalServerError, time.Since(startTime), "", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(trainedResp)

	logRequest("trained", http.StatusOK, time.Since(startTime), "", nil)
}

// Pega a lista de todas as cryptomoedas
func AllCryptos(w http.ResponseWriter, r *http.Request) {
	startTime := time.Now()

	resp, err := http.Get("http://backend-model:8000/cryptos")
	if err != nil {
		utils.CheckError(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		logRequest("all_cryptos", http.StatusInternalServerError, time.Since(startTime), "", err)
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		utils.CheckError(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		logRequest("all_cryptos", http.StatusInternalServerError, time.Since(startTime), "", err)
		return
	}

	var allCryptos models.AllCryptos
	err = json.Unmarshal(body, &allCryptos)
	if err != nil {
		utils.CheckError(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		logRequest("all_cryptos", http.StatusInternalServerError, time.Since(startTime), "", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(allCryptos)

	logRequest("all_cryptos", http.StatusOK, time.Since(startTime), "", nil)
}

// Testa a crypto
func TestCrypto(w http.ResponseWriter, r *http.Request) {
	startTime := time.Now()

	crypto := r.URL.Query().Get("crypto")
	crypto = strings.TrimSpace(crypto)

	log.Printf("Sanitized crypto: %s", crypto)
	if crypto == "" {
		http.Error(w, "Missing crypto parameter", http.StatusBadRequest)
		logRequest("test", http.StatusBadRequest, time.Since(startTime), "", nil)
		return
	}

	backendURL := "http://backend-model:8000/test/" + crypto
	resp, err := http.Get(backendURL)
	if err != nil {
		log.Printf("Error calling backend model: %v\n", err)
		http.Error(w, "Error calling backend model", http.StatusInternalServerError)
		logRequest("test", http.StatusInternalServerError, time.Since(startTime), crypto, err)
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Error reading backend response: %v\n", err)
		http.Error(w, "Error reading backend response", http.StatusInternalServerError)
		logRequest("test", http.StatusInternalServerError, time.Since(startTime), crypto, err)
		return
	}

	var comparisonResp models.TestPredicted
	err = json.Unmarshal(body, &comparisonResp)
	if err != nil {
		log.Printf("Error unmarshalling backend response: %v\n", err)
		http.Error(w, "Error processing backend response", http.StatusInternalServerError)
		logRequest("test", http.StatusInternalServerError, time.Since(startTime), crypto, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comparisonResp)

	logRequest("test", http.StatusOK, time.Since(startTime), crypto, nil)
}
