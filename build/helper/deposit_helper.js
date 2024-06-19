import { checkEthBalance, checkMNTBalance } from "./token_balance.js";
import { setupCrossChainMessengerFoEth, setupCrossChainMessengerForMnt, } from "./cross_chain_messenger.js";
import { MessageStatus } from "@mantleio/sdk";
import { ethers } from "ethers";
import { environment } from "../utils/environment.js";
import { decimalStringToBigInt } from "../utils/maths.js";
import { ERROR_CODE, generateError } from "../constants/errors.js";
export async function depositETH(privateKey, amount) {
    console.log("Deposit ETH");
    const start = new Date();
    const { l2Wallet, crossChainMessenger } = await setupCrossChainMessengerFoEth(privateKey);
    const eth = ethers.utils.parseEther(amount);
    let response;
    try {
        response = await crossChainMessenger.depositETH(eth, {
            overrides: { gasLimit: environment.ethGasLimit },
        });
    }
    catch (err) {
        if (err.error) {
            const errorDetails = err.error;
            console.log("Error details:", errorDetails.message);
            if (errorDetails.message.includes("intrinsic gas too low")) {
                throw generateError(ERROR_CODE.INTRINSIC_GAS_TOO_LOW);
            }
            else if (errorDetails.message.includes("")) {
            }
            else {
                throw generateError(ERROR_CODE.DEPOSIT_FAILED);
            }
        }
    }
    console.log(`Transaction hash (on L1): ${response.hash}`);
    await response.wait();
    console.log("Waiting for status to change to RELAYED");
    await crossChainMessenger.waitForMessageStatus(response, MessageStatus.RELAYED);
    const { l1Balance, l2Balance } = await checkEthBalance(l2Wallet, crossChainMessenger);
    return {
        totalExecutionTime: (new Date().getTime() - start.getTime()) / 1000,
        txnHash: response.hash,
        ethBalanceOnL1: l1Balance,
        ethBalanceOnL2: l2Balance,
    };
}
export async function depositMNT(privateKey, amount) {
    console.log("#################### Deposit MNT ####################");
    const start = new Date();
    const { l1Wallet, crossChainMessenger, l1MntContract } = await setupCrossChainMessengerForMnt(privateKey);
    const precision = 18; // Number of decimal places your system uses, commonly 18 for many tokens
    const totalMNT = decimalStringToBigInt(amount, precision);
    console.log(totalMNT.toString());
    let allowTxnResponse;
    try {
        allowTxnResponse = await crossChainMessenger.approveERC20(environment.l1Mnt, environment.l2Mnt, totalMNT.toString());
    }
    catch (err) {
        throw generateError(ERROR_CODE.APPROVE_TXN_FAILED);
    }
    await allowTxnResponse.wait();
    let response;
    try {
        response = await crossChainMessenger.depositMNT(totalMNT.toString(), {
            overrides: { gasLimit: environment.ethGasLimit },
        });
        console.log(`Deposit transaction hash (on L1): ${response.hash}`);
    }
    catch (err) {
        if (err.error) {
            const errorDetails = err.error;
            console.log("Error details:", errorDetails.message);
            if (errorDetails.message.includes("intrinsic gas too low")) {
                throw generateError(ERROR_CODE.INTRINSIC_GAS_TOO_LOW);
            }
            else if (errorDetails.message.includes("")) {
            }
            else {
                throw generateError(ERROR_CODE.DEPOSIT_FAILED);
            }
        }
    }
    console.log(`Transaction hash (on L1): ${response.hash}`);
    await response.wait();
    console.log("Waiting for status to change to RELAYED");
    await crossChainMessenger.waitForMessageStatus(response, MessageStatus.RELAYED);
    const { l1Balance, l2Balance } = await checkMNTBalance(l1Wallet, l1MntContract, crossChainMessenger);
    return {
        totalExecutionTime: (new Date().getTime() - start.getTime()) / 1000,
        txnHash: response.hash,
        mntBalanceOnL1: l1Balance,
        mntBalanceOnL2: l2Balance,
    };
}
