# REBALANCE FUNDS SERVICE

IT WILL HELP IN BRIDGING TOKENS FROM ETH SEPOLIA TO MANTLE SEPOLIA AND VICE VERSA ON SAME WALLET ADDRESS.
CURRENTLY ETH TOKEN AND MANTLE TOKEN TRANSFER IS SUPPORTED

## INTITIAL SETUP

0. Download and Install Docker Engine if not already installed

1. Run command `make rebalance-funds` to up docker image and create local server

## ENDPOINTS INFO

0. Deposit Endpoint: `http://localhost:9000/api/deposit_to_mantle`
   Its a `POST` request ENDPOINT which deposits tokens from Eth Sepolia Chain to Mantle Sepolia Chain

   Sample Request

   ```
   {
    "token": "MNT", // Supported tokens are: ETH, MNT
    "private_key": "wallet private key",
    "amount": "1" // should be in ETH or MNT
   }
   ```

   Sample Response

   ```
   {
    "TxnHash": "0xd15721f14c6b23f6fcd9bb1fbefd63c861e60ceabb600c9c54982a29437485df",
    "TotalTimeToTransfer": 91.031,
    "AvailableBalanceOnL1": 84.54, // balance available after transaction on Eth Sepolia Chain
    "AvailableBalanceOnL2": 19.56 // balance available after transaction on Mantle Sepolia Chain
   }
   ```

1. Withdraw Endpoint: `http://localhost:9000/api/withdraw_from_mantle`
   Its a `POST` request ENDPOINT which withdraws tokens from Mantle Sepolia Chain to Eth Sepolia Chain
   Sample Request

   ```
   {
    "token": "MNT", // Supported tokens are: ETH, MNT
    "private_key": "wallet private key",
    "amount": "1" // should be in ETH or MNT
   }
   ```

   Sample Response

   ```
   {
    "TxnHash": "0xd15721f14c6b23f6fcd9bb1fbefd63c861e60ceabb600c9c54982a29437485df",
    "TotalTimeToTransfer": 91.031,
    "Message":
        "Withdraw has initiated from layer 2 to layer 1 chain and it may take several hours before reaching terminal state",
   }
   ```

   NOTE: Since we are depositing to Eth Sepolia chain from Mantle using this endpoint, it make several hours before the transaction reaches terminal state
