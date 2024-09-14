package routes

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/AntonioArtimonte/Ponderada-Modelo/controllers"
)

func ApiHandlers() http.Handler {
	router := chi.NewRouter()

	router.Group(func(r chi.Router) {
		r.Get("/db", controllers.GetDB)

		// Crypto ones
		r.Post("/train", controllers.TrainModel)
		r.Post("/predict", controllers.PredictCrypto)

		// Check trained crypto
		r.Get("/trained", controllers.TrainedCrypto)

		// Get all ever trained cryptos
		r.Get("/cryptos", controllers.AllCryptos)

		r.Get("/test", controllers.TestCrypto)
	})

	return router
}
