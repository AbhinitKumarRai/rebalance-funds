import cors from "cors";
import { Server } from "hyper-express";
import { apiRouter } from "./routers/rest.js";
import { environment, setupEnvironment } from "./utils/environment.js";
// ------------------------initialize environment variables ------------------------
await setupEnvironment();
//  ---------------------------- hyper-express server ----------------------------
const app = new Server();
// json body parser middleware
const jsonParser = async (req) => {
    const result = await req.json();
    req.body = result;
};
app.use(cors({
    origin: "*",
    methods: ["POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use("/", jsonParser);
//  ---------------------------- routes ----------------------------
app.get("/", (_request, response) => {
    response.send("API Working!");
});
app.use("/api", apiRouter);
app.listen(environment.port);
// import { ethers } from "ethers";
// import { CrossChainMessenger, MessageStatus } from "@mantleio/sdk";
// import fs from "fs";
// import { environment, setupEnvironment } from "./utils/environment.js";
// // Load environment variables
// setupEnvironment();
// console.log(process.cwd());
// // Read JSON files
// const L1TestERC20 = JSON.parse(
//   fs.readFileSync("./L1TestERC20.json", "utf-8")
// );
// const L2StandardERC20 = JSON.parse(
//   fs.readFileSync("./L2StandardERC20.json", "utf-8")
// );
// // Create ContractFactory instances
// const factory__L1_ERC20 = new ethers.ContractFactory(
//   L1TestERC20.abi,
//   L1TestERC20.bytecode
// );
// const factory__L2_ERC20 = new ethers.ContractFactory(
//   L2StandardERC20.abi,
//   L2StandardERC20.bytecode
// );
// // Environment variables
// const l1bridge = environment.l1Bridge as string;
// const l2bridge = environment.l2Bridge as string;
// const key = environment.key as string;
// // Ethereum providers and wallets
// const l1RpcProvider = new ethers.providers.JsonRpcProvider(
//   environment.l1Rpc as string
// );
// const l2RpcProvider = new ethers.providers.JsonRpcProvider(
//   environment.l2Rpc as string
// );
// const l1Wallet = new ethers.Wallet(key, l1RpcProvider);
// const l2Wallet = new ethers.Wallet(key, l2RpcProvider);
// // Global variables
// let crossChainMessenger: CrossChainMessenger;
// let l1ERC20: ethers.Contract;
// let l2ERC20: ethers.Contract;
// let ourAddr: string;
// // Setup function
// const setup = async () => {
//   ourAddr = l1Wallet.address;
//   crossChainMessenger = new CrossChainMessenger({
//     l1ChainId: Number(environment.l1ChainId),
//     l2ChainId: Number(environment.l2ChainId),
//     l1SignerOrProvider: l1Wallet,
//     l2SignerOrProvider: l2Wallet,
//     bedrock: true,
//   });
//   console.log("#################### Deploy ERC20 ####################");
//   // Deploy L1 ERC20
//   console.log("Deploying L1 ERC20...");
//   const L1_ERC20 = await factory__L1_ERC20
//     .connect(l1Wallet)
//     .deploy("L1 TEST TOKEN", "LTT");
//   await L1_ERC20.deployTransaction.wait();
//   console.log("L1 ERC20 Contract ExampleToken Address: ", L1_ERC20.address);
//   // Mint tokens to the wallet
//   let amount = ethers.utils.parseEther("10");
//   await L1_ERC20.connect(l1Wallet).mint(amount);
//   let balance = (
//     await L1_ERC20.connect(l1Wallet).balanceOf(l1Wallet.address)
//   ).toString();
//   console.log("Minted to ", l1Wallet.address, balance, " success");
//   // Approve tokens for the bridge
//   await L1_ERC20.connect(l1Wallet).approve(l1bridge, amount);
//   let allowance = await L1_ERC20.connect(l1Wallet).allowance(
//     l1Wallet.address,
//     l1bridge
//   );
//   console.log("Allowance: ", allowance.toString());
//   // Deploy L2 ERC20
//   console.log("Deploying L2 ERC20...");
//   const L2_ERC20 = await factory__L2_ERC20
//     .connect(l2Wallet)
//     .deploy(L1_ERC20.address);
//   await L2_ERC20.deployTransaction.wait();
//   console.log(
//     "L2 ERC20 Contract BVM_L2DepositedERC20 Address: ",
//     L2_ERC20.address,
//     "\n"
//   );
//   l1ERC20 = L1_ERC20;
//   l2ERC20 = L2_ERC20;
// };
// // Report ERC20 token balances
// const reportERC20Balances = async () => {
//   const l1Balance = await l1ERC20.balanceOf(ourAddr);
//   const l2Balance = await l2ERC20.balanceOf(ourAddr);
//   console.log(`Token on L1:${l1Balance}     Token on L2:${l2Balance}`);
// };
// // Constants
// const oneToken = ethers.BigNumber.from("1000000000000000000");
// // Deposit ERC20 function
// const depositERC20 = async () => {
//   console.log("#################### Deposit ERC20 ####################");
//   await reportERC20Balances();
//   const start = new Date();
//   // Approve ERC20 tokens for the bridge
//   const allowanceResponse = await crossChainMessenger.approveERC20(
//     l1ERC20.address,
//     l2ERC20.address,
//     oneToken
//   );
//   await allowanceResponse.wait();
//   console.log(`Allowance given by tx ${allowanceResponse.hash}`);
//   console.log(
//     `Time so far ${(new Date().getTime() - start.getTime()) / 1000} seconds`
//   );
//   // Deposit ERC20 tokens
//   const response = await crossChainMessenger.depositERC20(
//     l1ERC20.address,
//     l2ERC20.address,
//     oneToken
//   );
//   console.log(`Deposit transaction hash (on L1): ${response.hash}`);
//   await response.wait();
//   console.log("Waiting for status to change to RELAYED");
//   console.log(
//     `Time so far ${(new Date().getTime() - start.getTime()) / 1000} seconds`
//   );
//   await crossChainMessenger.waitForMessageStatus(
//     response.hash,
//     MessageStatus.RELAYED
//   );
//   await reportERC20Balances();
//   console.log(
//     `depositERC20 took ${
//       (new Date().getTime() - start.getTime()) / 1000
//     } seconds\n`
//   );
// };
// // Withdraw ERC20 function
// const withdrawERC20 = async () => {
//   console.log("#################### Withdraw ERC20 ####################");
//   const start = new Date();
//   await reportERC20Balances();
//   // Withdraw ERC20 tokens
//   const response = await crossChainMessenger.withdrawERC20(
//     l1ERC20.address,
//     l2ERC20.address,
//     oneToken
//   );
//   console.log(`Transaction hash (on L2): ${response.hash}`);
//   await response.wait();
//   console.log("Waiting for status to be READY_TO_PROVE");
//   console.log(
//     `Time so far ${(new Date().getTime() - start.getTime()) / 1000} seconds`
//   );
//   await crossChainMessenger.waitForMessageStatus(
//     response.hash,
//     MessageStatus.READY_TO_PROVE
//   );
//   console.log(
//     `Time so far ${(new Date().getTime() - start.getTime()) / 1000} seconds`
//   );
//   await crossChainMessenger.proveMessage(response.hash);
//   console.log("Waiting for status to change to IN_CHALLENGE_PERIOD");
//   console.log(
//     `Time so far ${(new Date().getTime() - start.getTime()) / 1000} seconds`
//   );
//   await crossChainMessenger.waitForMessageStatus(
//     response.hash,
//     MessageStatus.IN_CHALLENGE_PERIOD
//   );
//   console.log("In the challenge period, waiting for status READY_FOR_RELAY");
//   console.log(
//     `Time so far ${(new Date().getTime() - start.getTime()) / 1000} seconds`
//   );
//   await crossChainMessenger.waitForMessageStatus(
//     response.hash,
//     MessageStatus.READY_FOR_RELAY
//   );
//   console.log("Ready for relay, finalizing message now");
//   console.log(
//     `Time so far ${(new Date().getTime() - start.getTime()) / 1000} seconds`
//   );
//   await crossChainMessenger.finalizeMessage(response.hash);
//   console.log("Waiting for status to change to RELAYED");
//   console.log(
//     `Time so far ${(new Date().getTime() - start.getTime()) / 1000} seconds`
//   );
//   await crossChainMessenger.waitForMessageStatus(
//     response.hash,
//     MessageStatus.RELAYED
//   );
// };
// // Main function
// const main = async () => {
//   await setup();
//   await depositERC20();
//   // await withdrawERC20();
// };
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
// import { ethers, Overrides } from "ethers";
// import { CrossChainMessenger, MessageStatus } from "@mantleio/sdk";
// import { environment, setupEnvironment } from "./utils/environment.js";
// setupEnvironment();
// const key = environment.key as string;
// const l2ETH = environment.l2Eth as string;
// const l1RpcProvider = new ethers.providers.JsonRpcProvider(
//   environment.l1Rpc as string
// );
// const l2RpcProvider = new ethers.providers.JsonRpcProvider(
//   environment.l2Rpc as string
// );
// const l1Wallet = new ethers.Wallet(key, l1RpcProvider);
// const l2Wallet = new ethers.Wallet(key, l2RpcProvider);
// let crossChainMessenger: CrossChainMessenger;
// const setup = async () => {
//   crossChainMessenger = new CrossChainMessenger({
//     l1ChainId: Number(environment.l1ChainId),
//     l2ChainId: Number(environment.l2ChainId),
//     l1SignerOrProvider: l1Wallet,
//     l2SignerOrProvider: l2Wallet,
//     bedrock: true,
//   });
//   const l1Balance = await l1Wallet.getBalance();
//   const l2Balance = await l2Wallet.getBalance();
//   console.log(
//     l1Wallet.address,
//     "#################### l1Wallet Balance: ",
//     l1Balance.toString()
//   );
//   console.log(
//     l2Wallet.address,
//     "#################### l2Wallet Balance: ",
//     l2Balance.toString()
//   );
// };
// const eth = ethers.utils.parseEther("0.002"); // 0.01 ETH
// const doubleeth = ethers.utils.parseEther("0.001"); // 0.02 ETH
// const erc20ABI = [
//   {
//     constant: true,
//     inputs: [{ name: "_owner", type: "address" }],
//     name: "balanceOf",
//     outputs: [{ name: "balance", type: "uint256" }],
//     type: "function",
//   },
// ];
// const reportBalances = async () => {
//   const l1Balance = await crossChainMessenger.l1Signer.getBalance();
//   const BVM_ETH = new ethers.Contract(l2ETH, erc20ABI, l2Wallet);
//   const l2Balance = await BVM_ETH.balanceOf(
//     await crossChainMessenger.l2Signer.getAddress()
//   );
//   console.log(`On L1:${l1Balance}     On L2:${l2Balance} `);
// };
// const depositETH = async () => {
//   console.log("Deposit ETH");
//   await reportBalances();
//   const start = new Date();
//   const response = await crossChainMessenger.depositETH(eth);
//   console.log(`Transaction hash (on L1): ${response.hash}`);
//   await response.wait();
//   console.log("Waiting for status to change to RELAYED");
//   console.log(
//     `Time so far ${(new Date().getTime() - start.getTime()) / 1000} seconds`
//   );
//   await crossChainMessenger.waitForMessageStatus(
//     response,
//     MessageStatus.RELAYED
//   );
//   await reportBalances();
//   console.log(
//     `depositETH took ${
//       (new Date().getTime() - start.getTime()) / 1000
//     } seconds\n\n`
//   );
// };
// const withdrawETH = async (overrides: Overrides = { gasLimit: 30000 }) => {
//   console.log("Withdraw ETH");
//   const start = new Date();
//   await reportBalances();
//   const approveTx = await crossChainMessenger.approveERC20(
//     ethers.constants.AddressZero,
//     l2ETH,
//     doubleeth,
//     { overrides }
//   );
//   console.log(`Approve transaction hash (on L2): ${approveTx.hash}`);
//   await approveTx.wait();
//   console.log("Approval transaction confirmed.");
//   const response = await crossChainMessenger.withdrawERC20(
//     ethers.constants.AddressZero,
//     l2ETH,
//     eth,
//     { overrides }
//   );
//   console.log(`Transaction hash (on L2): ${response.hash}`);
//   await response.wait();
//   console.log("Waiting for status to be READY_TO_PROVE");
//   console.log(
//     `Time so far ${(new Date().getTime() - start.getTime()) / 1000} seconds`
//   );
//   await crossChainMessenger.waitForMessageStatus(
//     response.hash,
//     MessageStatus.READY_TO_PROVE
//   );
//   console.log(
//     `Time so far ${(new Date().getTime() - start.getTime()) / 1000} seconds`
//   );
//   await crossChainMessenger.proveMessage(response.hash);
//   console.log("Waiting for status to change to IN_CHALLENGE_PERIOD");
//   console.log(
//     `Time so far ${(new Date().getTime() - start.getTime()) / 1000} seconds`
//   );
//   await crossChainMessenger.waitForMessageStatus(
//     response.hash,
//     MessageStatus.IN_CHALLENGE_PERIOD
//   );
//   console.log("In the challenge period, waiting for status READY_FOR_RELAY");
//   console.log(
//     `Time so far ${(new Date().getTime() - start.getTime()) / 1000} seconds`
//   );
//   await crossChainMessenger.waitForMessageStatus(
//     response.hash,
//     MessageStatus.READY_FOR_RELAY
//   );
//   console.log("Ready for relay, finalizing message now");
//   console.log(
//     `Time so far ${(new Date().getTime() - start.getTime()) / 1000} seconds`
//   );
//   await crossChainMessenger.finalizeMessage(response.hash);
//   console.log("Waiting for status to change to RELAYED");
//   console.log(
//     `Time so far ${(new Date().getTime() - start.getTime()) / 1000} seconds`
//   );
//   await crossChainMessenger.waitForMessageStatus(
//     response,
//     MessageStatus.RELAYED
//   );
// };
// const main = async () => {
//   await setup();
//   // await depositETH();
//   await withdrawETH();
// };
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
