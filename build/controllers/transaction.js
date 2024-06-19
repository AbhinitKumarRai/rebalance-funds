import { depositETH, depositMNT } from "./../helper/deposit_helper.js";
import { withdrawETH, withdrawMNT } from "../helper/withdraw_helper.js";
export const deposit = async (req, res) => {
    const request = req.body;
    try {
        let totalExecutionTime, txnHash, l1Balance, l2Balance;
        if (request.token === "ETH") {
            const response = await depositETH(request.private_key, request.amount);
            totalExecutionTime = response.totalExecutionTime;
            txnHash = response.txnHash;
            l1Balance = response.ethBalanceOnL1;
            l2Balance = response.ethBalanceOnL2;
        }
        else if (request.token === "MNT") {
            const response = await depositMNT(request.private_key, request.amount);
            totalExecutionTime = response.totalExecutionTime;
            txnHash = response.txnHash;
            l1Balance = response.mntBalanceOnL1;
            l2Balance = response.mntBalanceOnL2;
        }
        res.json({
            TxnHash: txnHash,
            TotalTimeToTransfer: totalExecutionTime,
            AvailableBalanceOnL1: l1Balance,
            AvailableBalanceOnL2: l2Balance,
        });
    }
    catch (e) {
        console.log(e);
        const err = e;
        res.json({
            message: err.message,
            error_code: err.code,
        });
    }
};
export const withdraw = async (req, res) => {
    const request = req.body;
    try {
        let totalExecutionTime, txnHash;
        if (request.token == "ETH") {
            const response = await withdrawETH(request.private_key, request.amount);
            totalExecutionTime = response.totalExecutionTime;
            txnHash = response.txnHash;
        }
        else if (request.token === "MNT") {
            const response = await withdrawMNT(request.private_key, request.amount);
            totalExecutionTime = response.totalExecutionTime;
            txnHash = response.txnHash;
        }
        res.json({
            TxnHash: txnHash,
            TotalTimeToTransfer: totalExecutionTime,
            Message: "Withdraw has initiated from layer 2 to layer 1 chain and it may take several hours before reaching terminal state",
        });
    }
    catch (e) {
        console.log(e);
        const err = e;
        res.json({
            message: err.message,
            error_code: err.code,
        });
    }
};
