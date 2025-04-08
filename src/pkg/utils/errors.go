package utils

import (
	"fmt"
)

// ErrorCode represents different types of errors that can occur
type ErrorCode string

const (
	// General errors
	ErrorCodeInvalidInput ErrorCode = "INVALID_INPUT"
	ErrorCodeNotFound     ErrorCode = "NOT_FOUND"
	ErrorCodeUnauthorized ErrorCode = "UNAUTHORIZED"
	ErrorCodeForbidden    ErrorCode = "FORBIDDEN"
	ErrorCodeInternal     ErrorCode = "INTERNAL_ERROR"

	// Blockchain specific errors
	ErrorCodeTransactionFailed ErrorCode = "TRANSACTION_FAILED"
	ErrorCodeInvalidChainID    ErrorCode = "INVALID_CHAIN_ID"
	ErrorCodeInvalidAddress    ErrorCode = "INVALID_ADDRESS"
	ErrorCodeInsufficientFunds ErrorCode = "INSUFFICIENT_FUNDS"
	ErrorCodeGasLimitExceeded  ErrorCode = "GAS_LIMIT_EXCEEDED"
	ErrorCodeNetworkError      ErrorCode = "NETWORK_ERROR"
	ErrorCodeContractError     ErrorCode = "CONTRACT_ERROR"
	ErrorCodeRPCError          ErrorCode = "RPC_ERROR"
)

// CustomError represents a custom error with a specific error code
type CustomError struct {
	Code    ErrorCode
	Message string
	Err     error
	Data    interface{}
}

// Error implements the error interface
func (e *CustomError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %s (original error: %v)", e.Code, e.Message, e.Err)
	}
	return fmt.Sprintf("%s: %s", e.Code, e.Message)
}

// Unwrap returns the underlying error
func (e *CustomError) Unwrap() error {
	return e.Err
}

// NewCustomError creates a new custom error
func NewCustomError(code ErrorCode, message string, err error, data interface{}) *CustomError {
	return &CustomError{
		Code:    code,
		Message: message,
		Err:     err,
		Data:    data,
	}
}

// HandleError processes and handles errors appropriately
func HandleError(err error) error {
	if err == nil {
		return nil
	}

	// If it's already a CustomError, return it as is
	if customErr, ok := err.(*CustomError); ok {
		return customErr
	}

	// Convert common errors to CustomError
	switch {
	case err.Error() == "insufficient funds":
		return NewCustomError(ErrorCodeInsufficientFunds, "Insufficient funds for transaction", err, nil)
	case err.Error() == "gas limit exceeded":
		return NewCustomError(ErrorCodeGasLimitExceeded, "Gas limit exceeded", err, nil)
	case err.Error() == "network error":
		return NewCustomError(ErrorCodeNetworkError, "Network error occurred", err, nil)
	case err.Error() == "contract error":
		return NewCustomError(ErrorCodeContractError, "Contract error occurred", err, nil)
	case err.Error() == "rpc error":
		return NewCustomError(ErrorCodeRPCError, "RPC error occurred", err, nil)
	default:
		return NewCustomError(ErrorCodeInternal, "An internal error occurred", err, nil)
	}
}

// IsErrorCode checks if an error is of a specific error code
func IsErrorCode(err error, code ErrorCode) bool {
	if customErr, ok := err.(*CustomError); ok {
		return customErr.Code == code
	}
	return false
}

// GetErrorData retrieves the data associated with a CustomError
func GetErrorData(err error) interface{} {
	if customErr, ok := err.(*CustomError); ok {
		return customErr.Data
	}
	return nil
}
