package config

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var Client *mongo.Client
var Db *mongo.Database

const (
	DbName         string = "golang-db"
	CollectionName string = "golang-collection"
)

func init() {
	fmt.Println("Initializing MongoDB connection...")
	var err error

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	Client, err = mongo.Connect(ctx, options.Client().ApplyURI("mongodb://db:27017"))
	if err != nil {
		fmt.Println(err)
		return
	}

	err = Client.Ping(ctx, readpref.Primary())
	if err != nil {
		fmt.Println(err)
		return
	}

	Db = Client.Database(DbName)
}

func DisconnectMongo(ctx context.Context) error {
	return Client.Disconnect(ctx)
}
