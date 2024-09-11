package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors" // Import the CORS middleware package
	"github.com/AntonioArtimonte/Ponderada-Modelo/config"
	"github.com/AntonioArtimonte/Ponderada-Modelo/routes"
)

func main() {
	router := chi.NewRouter()

	// Enable CORS for the frontend running at http://localhost:3000
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"}, // Frontend URL
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,                             // Allow credentials if needed
		MaxAge:           300,                              // Maximum value for the preflight response cache
	}))

	router.Use(middleware.Logger)
	router.Mount("/api", routes.ApiHandlers())

	server := &http.Server{
		Addr:         ":9000",
		Handler:      router,
		ReadTimeout:  60 * time.Second,
		WriteTimeout: 60 * time.Second,
	}

	stopChan := make(chan os.Signal, 1)
	signal.Notify(stopChan, os.Interrupt)

	go func() {
		fmt.Println("Server started on port", 9000)
		if err := server.ListenAndServe(); err != nil {
			log.Printf("listen:%s\n", err)
		}
	}()

	sig := <-stopChan
	log.Printf("signal received: %v\n", sig)

	if err := config.DisconnectMongo(context.Background()); err != nil {
		panic(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server shutdown failed %v\n", err)
	}
	log.Println("Server shutdown properly")
}
