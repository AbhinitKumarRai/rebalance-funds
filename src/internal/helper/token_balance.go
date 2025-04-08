package helper

import (
	"context"
	"math/big"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/ethclient"
)

// ERC20ABI contains the minimum ABI needed for balance checking
var ERC20ABI = `[{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"}]`

// CheckEthBalance checks the ETH balance on both L1 and L2
func CheckEthBalance(l2Wallet *bind.TransactOpts, l1Client, l2Client *ethclient.Client) (float64, float64, error) {
	// Get L1 balance
	l1Balance, err := l1Client.BalanceAt(context.Background(), l2Wallet.From, nil)
	if err != nil {
		return 0, 0, err
	}

	// Get L2 balance
	l2Balance, err := l2Client.BalanceAt(context.Background(), l2Wallet.From, nil)
	if err != nil {
		return 0, 0, err
	}

	// Convert to float64 (wei to ETH)
	l1BalanceFloat := new(big.Float).Quo(
		new(big.Float).SetInt(l1Balance),
		new(big.Float).SetInt(big.NewInt(1e18)),
	)
	l2BalanceFloat := new(big.Float).Quo(
		new(big.Float).SetInt(l2Balance),
		new(big.Float).SetInt(big.NewInt(1e18)),
	)

	l1Balance64, _ := l1BalanceFloat.Float64()
	l2Balance64, _ := l2BalanceFloat.Float64()

	return l1Balance64, l2Balance64, nil
}

// CheckMNTBalance checks the MNT balance on both L1 and L2
func CheckMNTBalance(l1Wallet *bind.TransactOpts, l1MNTContract *bind.BoundContract, l2Client *ethclient.Client) (float64, float64, error) {
	// Get L1 balance
	var l1Balance *big.Int
	out := &[]interface{}{&l1Balance}
	err := l1MNTContract.Call(nil, out, "balanceOf", l1Wallet.From)
	if err != nil {
		return 0, 0, err
	}

	// Get L2 balance
	l2Balance, err := l2Client.BalanceAt(context.Background(), l1Wallet.From, nil)
	if err != nil {
		return 0, 0, err
	}

	// Convert to float64 (wei to MNT)
	l1BalanceFloat := new(big.Float).Quo(
		new(big.Float).SetInt(l1Balance),
		new(big.Float).SetInt(big.NewInt(1e18)),
	)
	l2BalanceFloat := new(big.Float).Quo(
		new(big.Float).SetInt(l2Balance),
		new(big.Float).SetInt(big.NewInt(1e18)),
	)

	l1Balance64, _ := l1BalanceFloat.Float64()
	l2Balance64, _ := l2BalanceFloat.Float64()

	return l1Balance64, l2Balance64, nil
}
