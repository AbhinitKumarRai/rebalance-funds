import { setupCrossChainMessengerFoEth, setupCrossChainMessengerForMnt, } from "./cross_chain_messenger.js";
import { MessageStatus } from "@mantleio/sdk";
import { ethers } from "ethers";
import { environment } from "../utils/environment.js";
import { decimalStringToBigInt } from "../utils/maths.js";
import { ERROR_CODE, generateError } from "../constants/errors.js";
export async function withdrawETH(privateKey, amount) {
    const overrides = { gasLimit: environment.mntGasLimit };
    console.log("#################### Withdraw ETH ####################");
    const start = new Date();
    const { l2Wallet, crossChainMessenger } = await setupCrossChainMessengerFoEth(privateKey);
    const eth = ethers.utils.parseEther(amount);
    let approveTx;
    try {
        approveTx = await crossChainMessenger.approveERC20(ethers.constants.AddressZero, environment.l2Eth, eth, { signer: l2Wallet, overrides });
    }
    catch (err) {
        throw generateError(ERROR_CODE.APPROVE_TXN_FAILED);
    }
    await approveTx.wait();
    console.log("Approval transaction confirmed.");
    let response;
    try {
        response = await crossChainMessenger.withdrawETH(eth, {
            overrides,
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
                throw generateError(ERROR_CODE.WITHDRAW_FAILED);
            }
        }
    }
    console.log(`Waiting for Transaction to initiate`);
    checkAndFinalizeWithdrawTxn(response, crossChainMessenger);
    // await response.wait();
    // console.log("Waiting for status to be READY_TO_PROVE");
    // await crossChainMessenger.waitForMessageStatus(
    //   response.hash,
    //   MessageStatus.READY_TO_PROVE
    // );
    // await crossChainMessenger.proveMessage(response.hash);
    // console.log("Waiting for status to change to IN_CHALLENGE_PERIOD");
    // await crossChainMessenger.waitForMessageStatus(
    //   response.hash,
    //   MessageStatus.IN_CHALLENGE_PERIOD
    // );
    // console.log("In the challenge period, waiting for status READY_FOR_RELAY");
    // await crossChainMessenger.waitForMessageStatus(
    //   response.hash,
    //   MessageStatus.READY_FOR_RELAY
    // );
    // console.log("Ready for relay, finalizing message now");
    // await crossChainMessenger.finalizeMessage(response.hash);
    // console.log("Waiting for status to change to RELAYED");
    // await crossChainMessenger.waitForMessageStatus(
    //   response,
    //   MessageStatus.RELAYED
    // );
    return {
        totalExecutionTime: (new Date().getTime() - start.getTime()) / 1000,
        txnHash: response.hash,
    };
}
export async function withdrawMNT(privateKey, amount) {
    console.log("#################### Withdraw MNT ####################");
    const start = new Date();
    const overrides = { gasLimit: environment.mntGasLimit };
    const { l1Wallet, crossChainMessenger, l1MntContract } = await setupCrossChainMessengerForMnt(privateKey);
    const precision = 18; // Number of decimal places your system uses, commonly 18 for many tokens
    const totalMNT = decimalStringToBigInt(amount, precision);
    let response;
    try {
        response = await crossChainMessenger.withdrawMNT(totalMNT.toString(), {
            overrides,
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
                throw generateError(ERROR_CODE.WITHDRAW_FAILED);
            }
        }
    }
    console.log(`Waiting for Transaction to initiate`);
    checkAndFinalizeWithdrawTxn(response, crossChainMessenger);
    // await response.wait();
    // console.log("Waiting for status to be READY_TO_PROVE");
    // await crossChainMessenger.waitForMessageStatus(
    //   response.hash,
    //   MessageStatus.READY_TO_PROVE
    // );
    // await crossChainMessenger.proveMessage(response.hash);
    // console.log("Waiting for status to change to IN_CHALLENGE_PERIOD");
    // await crossChainMessenger.waitForMessageStatus(
    //   response.hash,
    //   MessageStatus.IN_CHALLENGE_PERIOD
    // );
    // console.log("In the challenge period, waiting for status READY_FOR_RELAY");
    // await crossChainMessenger.waitForMessageStatus(
    //   response.hash,
    //   MessageStatus.READY_FOR_RELAY
    // );
    // console.log("Ready for relay, finalizing message now");
    // await crossChainMessenger.finalizeMessage(response.hash);
    // console.log("Waiting for status to change to RELAYED");
    // await crossChainMessenger.waitForMessageStatus(
    //   response.hash,
    //   MessageStatus.RELAYED
    // );
    return {
        totalExecutionTime: (new Date().getTime() - start.getTime()) / 1000,
        txnHash: response.hash,
    };
}
const checkAndFinalizeWithdrawTxn = async (response, crossChainMessenger) => {
    await new Promise((resolve) => setTimeout(resolve, 20000));
    console.log("Still waiting for the transaction initiation");
    await response.wait();
    console.log("Waiting for status to be READY_TO_PROVE");
    await crossChainMessenger.waitForMessageStatus(response.hash, MessageStatus.READY_TO_PROVE);
    await crossChainMessenger.proveMessage(response.hash);
    console.log("Waiting for status to change to IN_CHALLENGE_PERIOD");
    await crossChainMessenger.waitForMessageStatus(response.hash, MessageStatus.IN_CHALLENGE_PERIOD);
    console.log("In the challenge period, waiting for status READY_FOR_RELAY");
    await crossChainMessenger.waitForMessageStatus(response.hash, MessageStatus.READY_FOR_RELAY);
    console.log("Ready for relay, finalizing message now");
    await crossChainMessenger.finalizeMessage(response.hash);
    console.log("Waiting for status to change to RELAYED");
    await crossChainMessenger.waitForMessageStatus(response.hash, MessageStatus.RELAYED);
    const txnReceipt = await crossChainMessenger.getMessageReceipt(response.hash);
    if (txnReceipt.transactionReceipt.status === 0) {
        console.log(`Transaction with hash (on L2): ${response.hash} has failed`);
        return;
    }
    console.log(`Transaction with hash (on L2): ${response.hash} is success`);
    return;
};
