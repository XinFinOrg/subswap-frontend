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
  mints: { 551: "0x328A859C776E3a314d905296c5d21c3861B6c8a0" },
  locks: { 953: "0x40DAB3e1d7F44155FF9c39eFAd5a275F07F392F5" },
};

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

const crossChainTokens: CrossChainToken[] = [
  {
    name: "Token A",
    subnetChainId: 953,
    parentnetChainId: 551,
    subnetToken: "0x9ADb58BE55742cA8D32bB24aeE9A5eFe1419b916",
    selectedToken: "",
    logo: "/vercel.svg",
    mode: 3,
  },
];

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
