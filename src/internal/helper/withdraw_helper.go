package helper

import (
	"context"
	"errors"
	"math/big"
	"time"

	"github.com/AbhinitKumarRai/rebalance-funds/src/pkg/utils"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
)

// WithdrawResponse represents the response from a withdraw operation
type WithdrawResponse struct {
	TotalExecutionTime float64
	TxnHash            string
}

// WithdrawETH handles ETH withdrawals from L2 to L1
func WithdrawETH(privateKey string, amount float64) (*WithdrawResponse, error) {
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

	// Create withdraw transaction
	tx := types.NewTransaction(
		setup.L2Signer.Nonce.Uint64(),
		common.HexToAddress(utils.GetEnvironment().L2Bridge),
		weiAmount,
		uint64(utils.GetEnvironment().MNTGasLimit),
		big.NewInt(0),
		nil,
	)

	// Sign and send transaction
	signedTx, err := setup.L2Signer.Signer(setup.L2Signer.From, tx)
	if err != nil {
		return nil, err
	}

	err = setup.L2Client.SendTransaction(context.Background(), signedTx)
	if err != nil {
		return nil, err
	}

	// Wait for transaction to be mined
	receipt, err := bind.WaitMined(context.Background(), setup.L2Client, signedTx)
	if err != nil {
		return nil, err
	}

	// Check and finalize withdraw transaction
	err = checkAndFinalizeWithdrawTxn(receipt.TxHash, setup)
	if err != nil {
		return nil, err
	}

	return &WithdrawResponse{
		TotalExecutionTime: time.Since(start).Seconds(),
		TxnHash:            receipt.TxHash.Hex(),
	}, nil
}

// WithdrawMNT handles MNT withdrawals from L2 to L1
func WithdrawMNT(privateKey string, amount float64) (*WithdrawResponse, error) {
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

	// Create withdraw transaction
	tx := types.NewTransaction(
		setup.L1Wallet.Nonce.Uint64(),
		common.HexToAddress(utils.GetEnvironment().L2Bridge),
		weiAmount,
		uint64(utils.GetEnvironment().MNTGasLimit),
		big.NewInt(0),
		nil,
	)

	// Sign and send transaction
	signedTx, err := setup.L1Wallet.Signer(setup.L1Wallet.From, tx)
	if err != nil {
		return nil, err
	}

	err = setup.L2Client.SendTransaction(context.Background(), signedTx)
	if err != nil {
		return nil, err
	}

	// Wait for transaction to be mined
	receipt, err := bind.WaitMined(context.Background(), setup.L2Client, signedTx)
	if err != nil {
		return nil, err
	}

	// Check and finalize withdraw transaction
	err = checkAndFinalizeWithdrawTxn(receipt.TxHash, &CrossChainMessengerSetup{
		L1Client:  setup.L1Client,
		L2Client:  setup.L2Client,
		L1Signer:  setup.L1Wallet,
		L2Signer:  setup.L1Wallet,
		L1ChainID: setup.L1ChainID,
		L2ChainID: setup.L2ChainID,
	})
	if err != nil {
		return nil, err
	}

	return &WithdrawResponse{
		TotalExecutionTime: time.Since(start).Seconds(),
		TxnHash:            receipt.TxHash.Hex(),
	}, nil
}

// checkAndFinalizeWithdrawTxn handles the withdrawal finalization process
func checkAndFinalizeWithdrawTxn(txHash common.Hash, setup *CrossChainMessengerSetup) error {
	// Wait for transaction to be mined
	receipt, err := bind.WaitMined(context.Background(), setup.L2Client, &types.Transaction{})
	if err != nil {
		return err
	}

	// Check if transaction was successful
	if receipt.Status != types.ReceiptStatusSuccessful {
		return errors.New("withdraw transaction failed")
	}

	// TODO: Implement the rest of the withdrawal finalization process
	// This would include:
	// 1. Waiting for the challenge period
	// 2. Proving the withdrawal
	// 3. Finalizing the withdrawal
	// 4. Waiting for the withdrawal to be relayed

	return nil
}
