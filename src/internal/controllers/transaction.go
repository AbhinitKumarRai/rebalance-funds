package controllers

import (
	"net/http"

	"github.com/AbhinitKumarRai/rebalance-funds/src/internal/helper"
	"github.com/AbhinitKumarRai/rebalance-funds/src/pkg/utils"
	"github.com/gin-gonic/gin"
)

// DepositRequest represents the request body for deposit operations
type DepositRequest struct {
	PrivateKey string  `json:"private_key" binding:"required"`
	Amount     float64 `json:"amount" binding:"required"`
	Token      string  `json:"token" binding:"required"`
}

// WithdrawRequest represents the request body for withdraw operations
type WithdrawRequest struct {
	PrivateKey string  `json:"private_key" binding:"required"`
	Amount     float64 `json:"amount" binding:"required"`
	Token      string  `json:"token" binding:"required"`
}

// DepositResponse represents the response for deposit operations
type DepositResponse struct {
	TxnHash              string  `json:"TxnHash"`
	TotalTimeToTransfer  float64 `json:"TotalTimeToTransfer"`
	AvailableBalanceOnL1 float64 `json:"AvailableBalanceOnL1"`
	AvailableBalanceOnL2 float64 `json:"AvailableBalanceOnL2"`
}

// WithdrawResponse represents the response for withdraw operations
type WithdrawResponse struct {
	TxnHash             string  `json:"TxnHash"`
	TotalTimeToTransfer float64 `json:"TotalTimeToTransfer"`
	Message             string  `json:"Message"`
}

// Deposit handles deposit operations
func Deposit(c *gin.Context) {
	var req DepositRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var response *helper.DepositResponse
	var err error

	switch req.Token {
	case "ETH":
		response, err = helper.DepositETH(req.PrivateKey, req.Amount)
	case "MNT":
		response, err = helper.DepositMNT(req.PrivateKey, req.Amount)
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid token type"})
		return
	}

	if err != nil {
		if customErr, ok := err.(*utils.CustomError); ok {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message":    customErr.Message,
				"error_code": customErr.Code,
			})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, response)
}

// Withdraw handles withdraw operations
func Withdraw(c *gin.Context) {
	var req WithdrawRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var response *helper.WithdrawResponse
	var err error

	switch req.Token {
	case "ETH":
		response, err = helper.WithdrawETH(req.PrivateKey, req.Amount)
	case "MNT":
		response, err = helper.WithdrawMNT(req.PrivateKey, req.Amount)
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid token type"})
		return
	}

	if err != nil {
		if customErr, ok := err.(*utils.CustomError); ok {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message":    customErr.Message,
				"error_code": customErr.Code,
			})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, response)
}
