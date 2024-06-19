import { ethers } from "ethers";
import { environment } from "../utils/environment.js";
import { convertBigIntToNumber } from "../utils/maths.js";

const erc20ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
];

export const checkEthBalance = async (l2Wallet, crossChainMessenger) => {
  let l1Balance = await crossChainMessenger.l1Signer.getBalance();
  const BVM_ETH = new ethers.Contract(environment.l2Eth, erc20ABI, l2Wallet);
  let l2Balance = await BVM_ETH.balanceOf(
    await crossChainMessenger.l2Signer.getAddress()
  );

  l1Balance = convertBigIntToNumber(BigInt(l1Balance));
  l2Balance = convertBigIntToNumber(BigInt(l2Balance));

  return { l1Balance, l2Balance };
};

export const checkMNTBalance = async (
  l1Wallet,
  l1MntContract,
  crossChainMessenger
) => {
  let l1Balance = (await l1MntContract.balanceOf(l1Wallet.address)).toString();
  let l2Balance = (await crossChainMessenger.l2Signer.getBalance()).toString();

  l1Balance = convertBigIntToNumber(BigInt(l1Balance));
  l2Balance = convertBigIntToNumber(BigInt(l2Balance));

  return { l1Balance, l2Balance };
};
