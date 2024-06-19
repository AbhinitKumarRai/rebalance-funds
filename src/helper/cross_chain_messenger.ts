import { ethers, Overrides } from "ethers";
import { CrossChainMessenger } from "@mantleio/sdk";
import { environment } from "./../utils/environment.js";
import fs from "fs";

export const setupCrossChainMessengerFoEth = async (privateKey: string) => {
  let crossChainMessenger: CrossChainMessenger;

  const L1RpcProvider = new ethers.providers.JsonRpcProvider({
    url: environment.l1Rpc,
    skipFetchSetup: true,
  });
  const L2RpcProvider = new ethers.providers.JsonRpcProvider({
    url: environment.l2Rpc,
    skipFetchSetup: true,
  });
  const l1Wallet = await new ethers.Wallet(privateKey, L1RpcProvider);
  const l2Wallet = await new ethers.Wallet(privateKey, L2RpcProvider);
  crossChainMessenger = await new CrossChainMessenger({
    l1ChainId: Number(environment.l1ChainId),
    l2ChainId: Number(environment.l2ChainId),
    l1SignerOrProvider: l1Wallet,
    l2SignerOrProvider: l2Wallet,
    bedrock: true,
  });

  return { l2Wallet, crossChainMessenger };
};

export const setupCrossChainMessengerForMnt = async (privateKey: string) => {
  let crossChainMessenger: CrossChainMessenger;
  let l1MntContract: ethers.Contract;

  const L1RpcProvider = new ethers.providers.JsonRpcProvider({
    url: environment.l1Rpc,
    skipFetchSetup: true,
  });
  const L2RpcProvider = new ethers.providers.JsonRpcProvider({
    url: environment.l2Rpc,
    skipFetchSetup: true,
  });
  const l1Wallet = await new ethers.Wallet(privateKey, L1RpcProvider);
  const l2Wallet = await new ethers.Wallet(privateKey, L2RpcProvider);

  crossChainMessenger = new CrossChainMessenger({
    l1ChainId: Number(process.env.L1_CHAINID),
    l2ChainId: Number(process.env.L2_CHAINID),
    l1SignerOrProvider: l1Wallet,
    l2SignerOrProvider: l2Wallet,
    bedrock: true,
  });

  // Ensure correct paths or provide the correct TestERC20 JSON
  const L1TestERC20 = JSON.parse(
    fs.readFileSync("./abis/TestERC20.json", "utf-8")
  );
  l1MntContract = new ethers.Contract(
    environment.l1Mnt,
    L1TestERC20.abi,
    l1Wallet
  );

  return { l1Wallet, crossChainMessenger, l1MntContract };
};
