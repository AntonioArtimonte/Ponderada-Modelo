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
		r.Post("/db", controllers.CreateDB)
		r.Put("/db/{id}", controllers.UpdateDB)
		r.Delete("/db/{id}", controllers.DeleteDB)
	})

	return router
}
