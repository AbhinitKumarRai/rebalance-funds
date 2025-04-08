package middleware

import (
	"github.com/gin-gonic/gin"
)

// MiddlewareHandler is a type that represents a middleware function
type MiddlewareHandler gin.HandlerFunc

// HandlerWrapper wraps a Gin handler function
func HandlerWrapper(handler gin.HandlerFunc) gin.HandlerFunc {
	return handler
}
