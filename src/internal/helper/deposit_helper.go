package helper

import (
	"context"
	"math/big"
	"time"

	"github.com/AbhinitKumarRai/rebalance-funds/src/pkg/utils"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
)

// DepositResponse represents the response from a deposit operation
type DepositResponse struct {
	TotalExecutionTime float64
	TxnHash            string
	L1Balance          float64
	L2Balance          float64
}

// DepositETH handles ETH deposits from L1 to L2
func DepositETH(privateKey string, amount float64) (*DepositResponse, error) {
	start := time.Now()

	// Setup cross-chain messenger
	setup, err := SetupCrossChainMessengerForEth(privateKey)
	if err != nil {
		return nil, err
	}

	// Convert amount to wei
	weiAmount := new(big.Int).Mul(
		big.NewInt(int64(amount*1e18)),
		big.NewInt(1e18),
	)

	// Create deposit transaction
	tx := types.NewTransaction(
		setup.L1Signer.Nonce.Uint64(),
		common.HexToAddress(utils.GetEnvironment().L2Bridge),
		weiAmount,
		uint64(utils.GetEnvironment().EthGasLimit),
		big.NewInt(0),
		nil,
	)

	// Sign and send transaction
	signedTx, err := setup.L1Signer.Signer(setup.L1Signer.From, tx)
	if err != nil {
		return nil, err
	}

	err = setup.L1Client.SendTransaction(context.Background(), signedTx)
	if err != nil {
		return nil, err
	}

	// Wait for transaction to be mined
	receipt, err := bind.WaitMined(context.Background(), setup.L1Client, signedTx)
	if err != nil {
		return nil, err
	}

	// Check balances
	l1Balance, l2Balance, err := CheckEthBalance(setup.L2Wallet, setup.L1Client, setup.L2Client)
	if err != nil {
		return nil, err
	}

	return &DepositResponse{
		TotalExecutionTime: time.Since(start).Seconds(),
		TxnHash:            receipt.TxHash.Hex(),
		L1Balance:          l1Balance,
		L2Balance:          l2Balance,
	}, nil
}

// DepositMNT handles MNT deposits from L1 to L2
func DepositMNT(privateKey string, amount float64) (*DepositResponse, error) {
	start := time.Now()

	// Setup cross-chain messenger
	setup, err := SetupCrossChainMessengerForMNT(privateKey)
	if err != nil {
		return nil, err
	}

	// Convert amount to wei
	weiAmount := new(big.Int).Mul(
		big.NewInt(int64(amount*1e18)),
		big.NewInt(1e18),
	)

	// Approve MNT transfer
	approveTx, err := setup.L1MNTContract.Transact(setup.L1Wallet, "approve", utils.GetEnvironment().L2Bridge, weiAmount)
	if err != nil {
		return nil, err
	}

	// Wait for approval
	_, err = bind.WaitMined(context.Background(), setup.L1Client, approveTx)
	if err != nil {
		return nil, err
	}

	// Create deposit transaction
	tx := types.NewTransaction(
		setup.L1Wallet.Nonce.Uint64(),
		common.HexToAddress(utils.GetEnvironment().L2Bridge),
		weiAmount,
		uint64(utils.GetEnvironment().EthGasLimit),
		big.NewInt(0),
		nil,
	)

	// Sign and send transaction
	signedTx, err := setup.L1Wallet.Signer(setup.L1Wallet.From, tx)
	if err != nil {
		return nil, err
	}

	err = setup.L1Client.SendTransaction(context.Background(), signedTx)
	if err != nil {
		return nil, err
	}

	// Wait for transaction to be mined
	receipt, err := bind.WaitMined(context.Background(), setup.L1Client, signedTx)
	if err != nil {
		return nil, err
	}

	// Check balances
	l1Balance, l2Balance, err := CheckMNTBalance(setup.L1Wallet, setup.L1MNTContract, setup.L2Client)
	if err != nil {
		return nil, err
	}

	return &DepositResponse{
		TotalExecutionTime: time.Since(start).Seconds(),
		TxnHash:            receipt.TxHash.Hex(),
		L1Balance:          l1Balance,
		L2Balance:          l2Balance,
	}, nil
}
