import { Chain } from "wagmi";
// import { existsSync, readFileSync } from 'fs';
import * as mountConfig from './subswap-frontend.config.json';

export { default as tokenABI } from "./abi/tokenABI.json";
export { default as lockABI } from "./abi/lockABI.json";
export { default as mintABI } from "./abi/mintABI.json";

//devnet
// const parentnet = {
//   chainid: 551,
//   url: "https://devnetstats.apothem.network/devnet",
// };

// testnet
// const parentnet = {
//   chainid: 51,
//   url: "https://erpc.apothem.network/",
// };

//mainnet
// const parentnet = {
//   chainid: 50,
//   url: "https://rpc.xinfin.network",
// };

const parentnet = {
  chainid: Number(mountConfig.parentnetChainId),
  url: mountConfig.parentnetUrl
}

const subnet = {
  chainid: Number(mountConfig.subnetChainId)
};

export const xdcParentNet: Chain = {
  id: parentnet.chainid,
  name: "XDC Parentnet",
  network: "XDC Parentnet",
  nativeCurrency: {
    decimals: 18,
    name: "XDC",
    symbol: "XDC",
  },
  rpcUrls: {
    public: { http: [parentnet.url] },
    default: { http: [parentnet.url] },
  },
};

interface Applications {
  mints: { [x: number]: string };
  locks: { [x: number]: string };
}

export interface CrossChainToken {
  name: string;
  subnetChainId: number;
  parentnetChainId: number;
  subnetToken: string;
  selectedToken: string;
  logo: string;
  // 1: only subnet to parentnet, 2: only parentnet to subnet, 3: both way
  mode: 1 | 2 | 3;
}

const applications: Applications = {
  mints: { [parentnet.chainid]: mountConfig['parentnetApp'] }, //parentnet subswap addr
  locks: { [subnet.chainid]: mountConfig['subnetApp'] }, //subnet subswap addr
}


const crossChainTokens: CrossChainToken[] = []
for (let i = 0; i < mountConfig['tokens'].length; i++) {
  const token = mountConfig['tokens'][i]
  const mode = ('mode' in token) ? token['mode'] as CrossChainToken["mode"] : 3
  
  crossChainTokens.push(
    {
      name: token['name'],
      subnetChainId: subnet.chainid,
      parentnetChainId: parentnet.chainid,
      subnetToken: token['address'],
      selectedToken: "",
      logo: "/vercel.svg",
      mode: mode
    }
  )
}  

export const getTokens = (
  subnetChainId: number | undefined,
  parentnetChainId: number,
  bridgeMode: number
) => {
  const tokens = [];

  for (const token of crossChainTokens) {
    if (
      token.subnetChainId === subnetChainId &&
      token.parentnetChainId === parentnetChainId &&
      (token.mode == 3 || bridgeMode === token.mode)
    ) {
      tokens.push(token);
    }
  }

  return tokens;
};

export const getLock = (chainId: number | undefined) => {
  if (!chainId) {
    return;
  }

  return applications.locks[chainId];
};

export const getMint = (chainId: number | undefined) => {
  if (!chainId) {
    return;
  }

  return applications.mints[chainId];
};

export const getNetwork = async (
  rpcName: string,
  rpcUrl: string
): Promise<Chain> => {
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_chainId",
      params: [],
      id: 1,
    }),
  });

  const json = await response.json();
  const chainId = Number(json.result);
  const network: Chain = {
    id: chainId,
    name: rpcName,
    network: rpcName,
    nativeCurrency: {
      decimals: 18,
      name: "XDC",
      symbol: "XDC",
    },
    rpcUrls: {
      public: { http: [rpcUrl] },
      default: { http: [rpcUrl] },
    },
  };

  return network;
};
