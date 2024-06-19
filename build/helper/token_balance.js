import { ethers } from "ethers";
import { environment } from "../utils/environment.js";
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
    const l1Balance = await crossChainMessenger.l1Signer.getBalance();
    const BVM_ETH = new ethers.Contract(environment.l2Eth, erc20ABI, l2Wallet);
    const l2Balance = await BVM_ETH.balanceOf(await crossChainMessenger.l2Signer.getAddress());
    console.log(`ETH On L1:${l1Balance}     On L2:${l2Balance} `);
    return { l1Balance, l2Balance };
};
export const checkMNTBalance = async (l1Wallet, l1MntContract, crossChainMessenger) => {
    const l1Balance = (await l1MntContract.balanceOf(l1Wallet.address))
        .toString()
        .slice(0, -18);
    const l2Balance = (await crossChainMessenger.l2Signer.getBalance())
        .toString()
        .slice(0, -18);
    console.log(`MNT On L1:${l1Balance}   and  On L2:${l2Balance} `);
    return { l1Balance, l2Balance };
};
