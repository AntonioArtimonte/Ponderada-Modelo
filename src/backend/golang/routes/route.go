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

		// Crypto
		r.Post("/train", controllers.TrainModel)
		r.Post("/predict", controllers.PredictCrypto)
		r.Post("/retrain", controllers.RetrainModel)

		// Checar crypto treinada
		r.Get("/trained", controllers.TrainedCrypto)

		// Pegar todas as cryptos
		r.Get("/cryptos", controllers.AllCryptos)

		// Testas crypto
		r.Get("/test", controllers.TestCrypto)
	})

	return router
}
