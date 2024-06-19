import { cleanEnv, num, str } from "envalid";

interface Environment {
  port: number;
  l1Rpc: string;
  l2Rpc: string;
  l1ChainId: string;
  l2ChainId: string;
  l1Cdm: string;
  l2Cdm: string;
  l1CrossDomainMessengerAddress: string;
  l2OutputOracle: string;
  l1Mnt: string;
  l2Mnt: string;
  l2Eth: string;
  ethGasLimit: number;
  mntGasLimit: number;
}

export const environment: Environment = {
  port: 0,
  l1Rpc: "",
  l2Rpc: "",
  l1ChainId: "",
  l2ChainId: "",
  l1Cdm: "",
  l2Cdm: "",
  l1CrossDomainMessengerAddress: "",
  l2OutputOracle: "",
  l1Mnt: "",
  l2Mnt: "",
  l2Eth: "",
  ethGasLimit: 0,
  mntGasLimit: 0,
};

export const setupEnvironment = async () => {
  const devEnvs = cleanEnv(process.env, {
    PORT: num(),
    L1_RPC: str(),
    L2_RPC: str(),
    L1_CHAINID: str(),
    L2_CHAINID: str(),
    L1_CDM: str(),
    L2_CDM: str(),
    L1_CROSS_DOMAIN_MESSENGER_ADDRESS: str(),
    L2_OUTPUT_ORACLE: str(),
    L1_MNT: str(),
    L2_MNT: str(),
    L2_ETH: str(),
    ETH_GAS_LIMIT: num(),
    MNT_GAS_LIMIT: num(),
  });
  environment.port = devEnvs.PORT;
  environment.l1Rpc = devEnvs.L1_RPC;
  environment.l2Rpc = devEnvs.L2_RPC;
  environment.l1ChainId = devEnvs.L1_CHAINID;
  environment.l2ChainId = devEnvs.L2_CHAINID;
  environment.l1Cdm = devEnvs.L1_CDM;
  environment.l2Cdm = devEnvs.L2_CDM;
  environment.l1CrossDomainMessengerAddress =
    devEnvs.L1_CROSS_DOMAIN_MESSENGER_ADDRESS;
  environment.l2OutputOracle = devEnvs.L2_OUTPUT_ORACLE;
  environment.l1Mnt = devEnvs.L1_MNT;
  environment.l2Mnt = devEnvs.L2_MNT;
  environment.l2Eth = devEnvs.L2_ETH;
  environment.ethGasLimit = devEnvs.ETH_GAS_LIMIT;
  environment.mntGasLimit = devEnvs.MNT_GAS_LIMIT;
};
