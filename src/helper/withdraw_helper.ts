import {
  setupCrossChainMessengerFoEth,
  setupCrossChainMessengerForMnt,
} from "./cross_chain_messenger.js";
import { MessageStatus } from "@mantleio/sdk";
import { ethers, Overrides } from "ethers";
import { environment } from "../utils/environment.js";
import { decimalStringToBigInt } from "../utils/maths.js";
import { ERROR_CODE, generateError, handleError } from "../utils/errors.js";

export async function withdrawETH(
  privateKey,
  amount
): Promise<{ totalExecutionTime; txnHash }> {
  const overrides: Overrides = { gasLimit: environment.mntGasLimit };

  const start = new Date();
  const { l2Wallet, crossChainMessenger } = await setupCrossChainMessengerFoEth(
    privateKey
  );

  const eth = ethers.utils.parseEther(amount);

  let approveTx;
  try {
    approveTx = await crossChainMessenger.approveERC20(
      ethers.constants.AddressZero,
      environment.l2Eth,
      eth,
      { overrides }
    );
  } catch (err) {
    console.log(err);
    const errorCode = handleError(err, ERROR_CODE.APPROVE_TXN_FAILED);
    throw generateError(errorCode);
  }
  // await approveTx.wait();

  let response;
  try {
    response = await crossChainMessenger.withdrawETH(eth, {
      overrides,
    });
  } catch (err) {
    console.log(err);
    const errorCode = handleError(err, ERROR_CODE.WITHDRAW_FAILED);
    throw generateError(errorCode);
  }
  checkAndFinalizeWithdrawTxn(response, crossChainMessenger);

  return {
    totalExecutionTime: (new Date().getTime() - start.getTime()) / 1000,
    txnHash: response.hash,
  };
}

export async function withdrawMNT(
  privateKey,
  amount
): Promise<{ totalExecutionTime; txnHash }> {
  const start = new Date();

  const overrides: Overrides = { gasLimit: environment.mntGasLimit };
  const { l1Wallet, crossChainMessenger, l1MntContract } =
    await setupCrossChainMessengerForMnt(privateKey);

  const precision = 18; // Number of decimal places your system uses, commonly 18 for many tokens
  const totalMNT = decimalStringToBigInt(amount, precision);
  let response;
  try {
    response = await crossChainMessenger.withdrawMNT(totalMNT.toString(), {
      overrides,
    });
  } catch (err) {
    console.log(err);
    const errorCode = handleError(err, ERROR_CODE.WITHDRAW_FAILED);
    throw generateError(errorCode);
  }

  checkAndFinalizeWithdrawTxn(response, crossChainMessenger);

  return {
    totalExecutionTime: (new Date().getTime() - start.getTime()) / 1000,
    txnHash: response.hash,
  };
}

const checkAndFinalizeWithdrawTxn = async (response, crossChainMessenger) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log(`Waiting for Transaction to initiate`);
  await response.wait();

  await crossChainMessenger.waitForMessageStatus(
    response.hash,
    MessageStatus.READY_TO_PROVE
  );
  await crossChainMessenger.proveMessage(response.hash);

  await crossChainMessenger.waitForMessageStatus(
    response.hash,
    MessageStatus.IN_CHALLENGE_PERIOD
  );

  await crossChainMessenger.waitForMessageStatus(
    response.hash,
    MessageStatus.READY_FOR_RELAY
  );

  await crossChainMessenger.finalizeMessage(response.hash);

  await crossChainMessenger.waitForMessageStatus(
    response.hash,
    MessageStatus.RELAYED
  );

  const txnReceipt = await crossChainMessenger.getMessageReceipt(response.hash);

  if (txnReceipt.transactionReceipt.status === 0) {
    console.log(
      `Withdraw Transaction with hash (on L2): ${response.hash} has failed`
    );
    return;
  }
  console.log(
    `Withdraw Transaction with hash (on L2): ${response.hash} is success`
  );
  return;
};
