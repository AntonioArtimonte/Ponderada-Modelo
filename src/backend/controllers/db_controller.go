package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strings"

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
			Date:       td.Date,
			StartValue: td.StartValue,
			EndValue:   td.EndValue,
			Model:      td.Model,
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

	if dbReq.Date == "" || dbReq.StartValue == 0 || dbReq.EndValue == 0 || dbReq.Model == "" {
		rnd.JSON(w, http.StatusBadRequest, renderer.M{
			"message": "All fields are required",
		})
		return
	}

	dbModel := models.DBModel{
		ID:         primitive.NewObjectID(),
		Date:       dbReq.Date,
		StartValue: dbReq.StartValue,
		EndValue:   dbReq.EndValue,
		Model:      dbReq.Model,
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

	if updateReq.StartValue == 0 || updateReq.EndValue == 0 || updateReq.Model == "" {
		rnd.JSON(w, http.StatusBadRequest, renderer.M{
			"message": "All fields are required",
		})
		return
	}

	filter := bson.M{"_id": objectID}
	update := bson.M{"$set": bson.M{
		"startValue": updateReq.StartValue,
		"endValue":   updateReq.EndValue,
		"model":      updateReq.Model,
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
		log.Printf("The id param is not a valid hex %v\n", err.Error())
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
