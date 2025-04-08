# REBALANCE FUNDS SERVICE

It will help in bridging tokens from Eth Sepolia to Mantle Sepolia and vice versa on same Wallet Address.
Currently ETH tokens and Mantle tokens transfer is only supported

## INITIAL SETUP

1. Install Go with version 1.24.1 or higher

2. Download and Install Docker Engine if not already installed

3. Make sure you have a `.env` file with all required environment variables

4. Run command `make rebalance-funds` to:
   - Build the Docker image
   - Run the container with the application
   - The service will be available at `http://localhost:8080`

## Development

### Local Development
To run the application locally without Docker:
```bash
go run main.go
```

### Docker Development
To build and run the application using Docker:
```bash
make rebalance-funds
```

## ENDPOINTS INFO

### Deposit Endpoint: `/api/deposit`

It's a `POST` request ENDPOINT which deposits tokens from Eth Sepolia Chain to Mantle Sepolia Chain.

**Sample Request:**

```json
{
  "token": "MNT", // Supported tokens are: ETH, MNT
  "private_key": "wallet private key",
  "amount": 1.0 // should be a float value
}
```

**Sample Response:**

```json
{
  "TxnHash": "0xd15721f14c6b23f6fcd9bb1fbefd63c861e60ceabb600c9c54982a29437485df",
  "TotalTimeToTransfer": 91.031,
  "AvailableBalanceOnL1": 84.54, // balance available after transaction on Eth Sepolia Chain
  "AvailableBalanceOnL2": 19.56 // balance available after transaction on Mantle Sepolia Chain
}
```

### Withdraw Endpoint: `/api/withdraw`

Its a `POST` request ENDPOINT which withdraws tokens from Mantle Sepolia Chain to Eth Sepolia Chain.

**Sample Request:**

```json
{
  "token": "MNT", // Supported tokens are: ETH, MNT
  "private_key": "wallet private key",
  "amount": 1.0 // should be a float value
}
```

**Sample Response:**

```json
{
  "TxnHash": "0xd15721f14c6b23f6fcd9bb1fbefd63c861e60ceabb600c9c54982a29437485df",
  "TotalTimeToTransfer": 91.031,
  "Message": "Withdraw has initiated from layer 2 to layer 1 chain and it may take several hours before reaching terminal state"
}
```

#### NOTE: Since we are depositing to Eth Sepolia chain from Mantle using this endpoint, it make several hours before the transaction reaches terminal state