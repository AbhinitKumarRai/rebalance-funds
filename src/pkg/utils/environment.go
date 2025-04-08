package utils

import (
	"fmt"
	"os"
)

// Environment represents the application's environment configuration
type Environment struct {
	Port        string
	L1RPC       string
	L2RPC       string
	L1ChainID   int64
	L2ChainID   int64
	L1MNT       string
	L2MNT       string
	L2Bridge    string
	L2Eth       string
	EthGasLimit int64
	MNTGasLimit int64
}

var env Environment

// SetupEnvironment initializes the environment variables
func SetupEnvironment() error {
	env = Environment{
		Port:        getEnv("PORT", "8080"),
		L1RPC:       getEnv("L1_RPC", ""),
		L2RPC:       getEnv("L2_RPC", ""),
		L1ChainID:   getEnvInt64("L1_CHAINID", 1),
		L2ChainID:   getEnvInt64("L2_CHAINID", 5000),
		L1MNT:       getEnv("L1_MNT", ""),
		L2MNT:       getEnv("L2_MNT", ""),
		L2Bridge:    getEnv("L2_BRIDGE", ""),
		L2Eth:       getEnv("L2_ETH", ""),
		EthGasLimit: getEnvInt64("ETH_GAS_LIMIT", 1000000),
		MNTGasLimit: getEnvInt64("MNT_GAS_LIMIT", 1000000),
	}
	return nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvInt64(key string, defaultValue int64) int64 {
	if value := os.Getenv(key); value != "" {
		var result int64
		_, err := fmt.Sscanf(value, "%d", &result)
		if err == nil {
			return result
		}
	}
	return defaultValue
}

// GetEnvironment returns the current environment configuration
func GetEnvironment() Environment {
	return env
}

// GetTestERC20ABI returns the TestERC20 ABI
func GetTestERC20ABI() string {
	return `[{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"}]`
}
