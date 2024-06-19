import { ethers } from "ethers";
import { environment } from "../utils/environment.js";
export const L1RpcProvider = new ethers.providers.JsonRpcProvider(environment.l1Rpc);
export const L2RpcProvider = new ethers.providers.JsonRpcProvider(environment.l2Rpc);
