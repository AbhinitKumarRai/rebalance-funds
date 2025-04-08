package helper

import (
	"context"
	"math/big"
	"strings"

	"github.com/AbhinitKumarRai/rebalance-funds/src/pkg/utils"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

// CrossChainMessengerSetup represents the setup for cross-chain operations
type CrossChainMessengerSetup struct {
	L2Wallet  *bind.TransactOpts
	L1Client  *ethclient.Client
	L2Client  *ethclient.Client
	L1Signer  *bind.TransactOpts
	L2Signer  *bind.TransactOpts
	L1ChainID *big.Int
	L2ChainID *big.Int
}

// CrossChainMessengerMNTSetup represents the setup for MNT cross-chain operations
type CrossChainMessengerMNTSetup struct {
	L1Wallet      *bind.TransactOpts
	L1Client      *ethclient.Client
	L2Client      *ethclient.Client
	L1MNTContract *bind.BoundContract
	L1ChainID     *big.Int
	L2ChainID     *big.Int
}

// SetupCrossChainMessengerForEth sets up the cross-chain messenger for ETH operations
func SetupCrossChainMessengerForEth(privateKey string) (*CrossChainMessengerSetup, error) {
	// Initialize Ethereum clients
	l1Client, err := ethclient.Dial(utils.GetEnvironment().L1RPC)
	if err != nil {
		return nil, err
	}
	l2Client, err := ethclient.Dial(utils.GetEnvironment().L2RPC)
	if err != nil {
		return nil, err
	}

	// Get chain IDs
	l1ChainID, err := l1Client.ChainID(context.Background())
	if err != nil {
		return nil, err
	}
	l2ChainID, err := l2Client.ChainID(context.Background())
	if err != nil {
		return nil, err
	}

	// Create wallets
	privateKeyECDSA, err := crypto.HexToECDSA(privateKey)
	if err != nil {
		return nil, err
	}

	l1Signer, err := bind.NewKeyedTransactorWithChainID(privateKeyECDSA, l1ChainID)
	if err != nil {
		return nil, err
	}

	l2Signer, err := bind.NewKeyedTransactorWithChainID(privateKeyECDSA, l2ChainID)
	if err != nil {
		return nil, err
	}

	return &CrossChainMessengerSetup{
		L2Wallet:  l2Signer,
		L1Client:  l1Client,
		L2Client:  l2Client,
		L1Signer:  l1Signer,
		L2Signer:  l2Signer,
		L1ChainID: l1ChainID,
		L2ChainID: l2ChainID,
	}, nil
}

// SetupCrossChainMessengerForMNT sets up the cross-chain messenger for MNT operations
func SetupCrossChainMessengerForMNT(privateKey string) (*CrossChainMessengerMNTSetup, error) {
	// Initialize Ethereum clients
	l1Client, err := ethclient.Dial(utils.GetEnvironment().L1RPC)
	if err != nil {
		return nil, err
	}
	l2Client, err := ethclient.Dial(utils.GetEnvironment().L2RPC)
	if err != nil {
		return nil, err
	}

	// Get chain IDs
	l1ChainID, err := l1Client.ChainID(context.Background())
	if err != nil {
		return nil, err
	}
	l2ChainID, err := l2Client.ChainID(context.Background())
	if err != nil {
		return nil, err
	}

	// Create wallet
	privateKeyECDSA, err := crypto.HexToECDSA(privateKey)
	if err != nil {
		return nil, err
	}

	l1Wallet, err := bind.NewKeyedTransactorWithChainID(privateKeyECDSA, l1ChainID)
	if err != nil {
		return nil, err
	}

	// Load MNT contract
	parsedABI, err := abi.JSON(strings.NewReader(utils.GetTestERC20ABI()))
	if err != nil {
		return nil, err
	}

	mntContract := bind.NewBoundContract(
		common.HexToAddress(utils.GetEnvironment().L1MNT),
		parsedABI,
		l1Client,
		l1Client,
		l1Client,
	)

	return &CrossChainMessengerMNTSetup{
		L1Wallet:      l1Wallet,
		L1Client:      l1Client,
		L2Client:      l2Client,
		L1MNTContract: mntContract,
		L1ChainID:     l1ChainID,
		L2ChainID:     l2ChainID,
	}, nil
}
