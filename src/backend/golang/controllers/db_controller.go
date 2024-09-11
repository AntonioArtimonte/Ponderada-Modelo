package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"bytes"
	"time"
	"io"

	"github.com/go-chi/chi/v5"
	"github.com/thedevsaddam/renderer"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"github.com/AntonioArtimonte/Ponderada-Modelo/config"
	"github.com/AntonioArtimonte/Ponderada-Modelo/models"
	"github.com/AntonioArtimonte/Ponderada-Modelo/utils"
)

var rnd *renderer.Render = renderer.New()

// GetDB retrieves all records from the database.
func GetDB(w http.ResponseWriter, r *http.Request) {
	var dbListFromDB []models.DBModel
	filter := bson.D{}

	cursor, err := config.Db.Collection(config.CollectionName).Find(context.Background(), filter)
	dbList := []models.DB{}

	if err = cursor.All(context.Background(), &dbListFromDB); err != nil {
		utils.CheckError(err)
	}

	for _, td := range dbListFromDB {
		dbList = append(dbList, models.DB{
			ID:         td.ID.Hex(),
			Crypto:     td.Crypto,
			Predictions: td.Predictions,
			Timestamp:  td.Timestamp,
		})
	}

	rnd.JSON(w, http.StatusOK, renderer.M{
		"message": "All data retrieved",
		"data":    dbList,
	})
}

// CreateDB inserts a new record into the database.
func CreateDB(w http.ResponseWriter, r *http.Request) {
	var dbReq models.CreateDB

	if err := json.NewDecoder(r.Body).Decode(&dbReq); err != nil {
		log.Printf("Failed to decode request body %v\n", err)
		rnd.JSON(w, http.StatusBadRequest, renderer.M{
			"message": "Invalid request",
		})
		return
	}

	if dbReq.Crypto == "" || len(dbReq.Predictions) == 0 || dbReq.Timestamp.IsZero() {
		rnd.JSON(w, http.StatusBadRequest, renderer.M{
			"message": "All fields are required",
		})
		return
	}

	dbModel := models.DBModel{
		ID:         primitive.NewObjectID(),
		Crypto:     dbReq.Crypto,
		Predictions: dbReq.Predictions,
	}

	_, err := config.Db.Collection(config.CollectionName).InsertOne(r.Context(), dbModel)
	if err != nil {
		utils.CheckError(err)
		rnd.JSON(w, http.StatusBadRequest, renderer.M{
			"message": "Could not insert into DB",
			"error":   err.Error(),
		})
		return
	}

	rnd.JSON(w, http.StatusOK, renderer.M{
		"message": "Data inserted successfully",
	})
}

// UpdateDB updates an existing record in the database.
func UpdateDB(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimSpace(chi.URLParam(r, "id"))
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		log.Printf("The id param is not a valid hex %v\n", err.Error())
		rnd.JSON(w, http.StatusBadRequest, renderer.M{
			"message": "Invalid ID",
		})
		return
	}

	var updateReq models.UpdateDB
	if err := json.NewDecoder(r.Body).Decode(&updateReq); err != nil {
		log.Printf("Failed to decode request body %v\n", err.Error())
		rnd.JSON(w, http.StatusBadRequest, renderer.M{
			"message": "Invalid request body",
		})
		return
	}

	if updateReq.Crypto == "" || len(updateReq.Predictions) == 0 || updateReq.Timestamp.IsZero() {
		rnd.JSON(w, http.StatusBadRequest, renderer.M{
			"message": "All fields are required",
		})
		return
	}

	filter := bson.M{"_id": objectID}
	update := bson.M{"$set": bson.M{
		"crypto":      updateReq.Crypto,
		"predictions": updateReq.Predictions,
		"timestamp":   updateReq.Timestamp,
	}}

	result, err := config.Db.Collection(config.CollectionName).UpdateOne(r.Context(), filter, update)
	if err != nil {
		log.Printf("Failed to update record %v\n", err.Error())
		rnd.JSON(w, http.StatusInternalServerError, renderer.M{
			"message": "Could not update the record",
			"error":   err.Error(),
		})
		return
	}

	if result.ModifiedCount == 0 {
		rnd.JSON(w, http.StatusNotFound, renderer.M{
			"message": "Record not found",
		})
		return
	}

	rnd.JSON(w, http.StatusOK, renderer.M{
		"message": "Record updated successfully",
		"data":    result.ModifiedCount,
	})
}

// DeleteDB removes a record from the database.
func DeleteDB(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		log.Printf("The id param is not a valid hex %v\n", err)
		rnd.JSON(w, http.StatusBadRequest, renderer.M{
			"message": "Invalid ID",
		})
		return
	}

	filter := bson.M{"_id": objectID}
	result, err := config.Db.Collection(config.CollectionName).DeleteOne(r.Context(), filter)
	if err != nil {
		log.Printf("Failed to delete record %v\n", err.Error())
		rnd.JSON(w, http.StatusInternalServerError, renderer.M{
			"message": "Could not delete the record",
			"error":   err.Error(),
		})
		return
	}

	if result.DeletedCount == 0 {
		rnd.JSON(w, http.StatusNotFound, renderer.M{
			"message": "Record not found",
		})
		return
	}

	rnd.JSON(w, http.StatusOK, renderer.M{
		"message": "Record deleted successfully",
		"data":    result.DeletedCount,
	})
}


func TrainModel(w http.ResponseWriter, r *http.Request) {
	var request models.TrainRequest
	_ = json.NewDecoder(r.Body).Decode(&request)

	jsonData, err := json.Marshal(request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Sending a request to the FastAPI /train endpoint
	resp, err := http.Post("http://backend-model:8000/train", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Parse the response into TrainResponse struct
	var trainResp models.TrainResponse
	err = json.Unmarshal(body, &trainResp)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Respond with the result from the FastAPI train endpoint
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(trainResp)
}


func PredictCrypto(w http.ResponseWriter, r *http.Request) {

	resp, err := http.Post("http://backend-model:8000/predict", "application/json", nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()


	body, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}


	var predictResp models.PredictResponse
	err = json.Unmarshal(body, &predictResp)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}


	dbModel := models.DBModel{
		ID:         primitive.NewObjectID(),
		Crypto:     predictResp.Crypto,
		Predictions: predictResp.Prediction,
		Timestamp:  time.Now(),
	}


	_, err = config.Db.Collection(config.CollectionName).InsertOne(context.TODO(), dbModel)
	if err != nil {
		log.Printf("Error inserting prediction into MongoDB: %v\n", err)
		http.Error(w, "Error storing prediction in the database", http.StatusInternalServerError)
		return
	}


	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(predictResp)
}



func TrainedCrypto(w http.ResponseWriter, r *http.Request) {

	resp, err := http.Get("http://backend-model:8000/trained")
	utils.CheckError(err)
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	utils.CheckError(err)

	var trainedResp models.TrainedResp
	err = json.Unmarshal(body, &trainedResp)
	utils.CheckError(err)

	json.NewEncoder(w).Encode(trainedResp)
}

func AllCryptos(w http.ResponseWriter, r *http.Request) {

	resp, err := http.Get("http://backend-model:8000/cryptos")
	utils.CheckError(err)
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	utils.CheckError(err)

	var allCryptos models.AllCryptos
	err = json.Unmarshal(body, &allCryptos)
	utils.CheckError(err)

	json.NewEncoder(w).Encode(allCryptos)
}