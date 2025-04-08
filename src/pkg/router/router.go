package router

import (
	"github.com/AbhinitKumarRai/rebalance-funds/src/internal/controllers"
	"github.com/gin-gonic/gin"
)

// SetupRouter configures all the routes for the application
func SetupRouter() *gin.Engine {
	router := gin.Default()

	// Health check endpoint
	router.GET("/", func(c *gin.Context) {
		c.String(200, "API Working!")
	})

	// API routes
	api := router.Group("/api")
	{
		api.POST("/deposit", controllers.Deposit)
		api.POST("/withdraw", controllers.Withdraw)
	}

	return router
}
