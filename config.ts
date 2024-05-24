import { Chain } from "wagmi";

export { default as tokenABI } from "./abi/tokenABI.json";
export { default as lockABI } from "./abi/lockABI.json";
export { default as mintABI } from "./abi/mintABI.json";

export const xdcParentNet: Chain = {
  id: 551,
  name: "XDC Devnet",
  network: "XDC Devnet",
  nativeCurrency: {
    decimals: 18,
    name: "XDC",
    symbol: "XDC",
  },
  rpcUrls: {
    public: { http: ["https://devnetstats.apothem.network/devnet"] },
    default: { http: ["https://devnetstats.apothem.network/devnet"] },
  },
};

interface Applications {
  mints: { [x: number]: string };
  locks: { [x: number]: string };
}

const applications: Applications = {
  mints: { 551: "0xC4471D0567322deaC9a4422A007156e92ac9A103" },
  locks: { 5173: "0x047695c6c781889F8955AbFaC6C99337C82b0C56" },
};

export interface CrossChainToken {
  name: string;
  subnetChainId: number;
  parentnetChainId: number;
  originalToken: string;
  logo: string;
  // 1: only subnet to parentnet, 2: only parentnet to subnet, 3: both way
  mode: 1 | 2 | 3;
}

const crossChainTokens: CrossChainToken[] = [
  {
    name: "Token A",
    subnetChainId: 5173,
    parentnetChainId: 551,
    originalToken: "0xA9fA2724E5905bb24Ec989e39cfB508246461bD2",
    logo: "/vercel.svg",
    mode: 1,
  },
];

export const getTokens = (
  subnetChainId: number | undefined,
  parentnetChainId: number,
  bridgeMode: number
) => {
  const tokens = [];

  console.log(subnetChainId, parentnetChainId, bridgeMode);

  for (const token of crossChainTokens) {
    if (
      token.subnetChainId === subnetChainId &&
      token.parentnetChainId === parentnetChainId &&
      (token.mode == 3 || bridgeMode === token.mode)
    ) {
      tokens.push(token);
    }
  }

  console.log(tokens);

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
