import { checkEthBalance, checkMNTBalance } from "./token_balance.js";
import {
  setupCrossChainMessengerFoEth,
  setupCrossChainMessengerForMnt,
} from "./cross_chain_messenger.js";
import { MessageStatus } from "@mantleio/sdk";
import { ethers } from "ethers";
import { environment } from "../utils/environment.js";
import { decimalStringToBigInt } from "../utils/maths.js";
import { ERROR_CODE, generateError, handleError } from "../utils/errors.js";

export async function depositETH(
  privateKey,
  amount
): Promise<{ totalExecutionTime; txnHash; ethBalanceOnL1; ethBalanceOnL2 }> {
  const start = new Date();

  const { l2Wallet, crossChainMessenger } = await setupCrossChainMessengerFoEth(
    privateKey
  );

  const eth = ethers.utils.parseEther(amount);
  let response;
  try {
    response = await crossChainMessenger.depositETH(eth, {
      overrides: { gasLimit: environment.ethGasLimit },
    });
  } catch (err) {
    const errorCode = handleError(err, ERROR_CODE.DEPOSIT_FAILED);
    throw generateError(errorCode);
  }

  console.log(`Deposit ETH transaction hash (on L1): ${response.hash}`);
  await response.wait();

  await crossChainMessenger.waitForMessageStatus(
    response,
    MessageStatus.RELAYED
  );

  const { l1Balance, l2Balance } = await checkEthBalance(
    l2Wallet,
    crossChainMessenger
  );

  return {
    totalExecutionTime: (new Date().getTime() - start.getTime()) / 1000,
    txnHash: response.hash,
    ethBalanceOnL1: l1Balance,
    ethBalanceOnL2: l2Balance,
  };
}

export async function depositMNT(
  privateKey,
  amount
): Promise<{ totalExecutionTime; txnHash; mntBalanceOnL1; mntBalanceOnL2 }> {
  const start = new Date();
  const { l1Wallet, crossChainMessenger, l1MntContract } =
    await setupCrossChainMessengerForMnt(privateKey);

  const precision = 18;
  const totalMNT = decimalStringToBigInt(amount, precision);

  let allowTxnResponse;
  try {
    allowTxnResponse = await crossChainMessenger.approveERC20(
      environment.l1Mnt,
      environment.l2Mnt,
      totalMNT.toString()
    );
  } catch (err) {
    const errorCode = handleError(err, ERROR_CODE.APPROVE_TXN_FAILED);
    throw generateError(errorCode);
  }
  await allowTxnResponse.wait();

  let response;
  try {
    response = await crossChainMessenger.depositMNT(totalMNT.toString(), {
      overrides: { gasLimit: environment.ethGasLimit },
    });
  } catch (err) {
    const errorCode = handleError(err, ERROR_CODE.DEPOSIT_FAILED);
    throw generateError(errorCode);
  }

  console.log(`Deposit MNT transaction hash (on L1): ${response.hash}`);
  await response.wait();

  await crossChainMessenger.waitForMessageStatus(
    response,
    MessageStatus.RELAYED
  );

  const { l1Balance, l2Balance } = await checkMNTBalance(
    l1Wallet,
    l1MntContract,
    crossChainMessenger
  );

  return {
    totalExecutionTime: (new Date().getTime() - start.getTime()) / 1000,
    txnHash: response.hash,
    mntBalanceOnL1: l1Balance,
    mntBalanceOnL2: l2Balance,
  };
}
