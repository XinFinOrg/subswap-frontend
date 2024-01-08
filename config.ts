export { default as tokenABI } from "./abi/tokenABI.json";
export { default as lockABI } from "./abi/lockABI.json";
export { default as mintABI } from "./abi/mintABI.json";

interface NativeCurrency {
  decimals: number;
  name: string;
  symbol: string;
}

interface RpcUrls {
  public: {
    http: string[];
  };
  default: {
    http: string[];
  };
}

export interface NetworkConfig {
  id: number;
  name: string;
  network: string;
  nativeCurrency: NativeCurrency;
  rpcUrls: RpcUrls;
}

export const xdcparentnet: NetworkConfig = {
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
  mints: { [x: number]: string; };
  locks: { [x: number]: string; };
}

const applications: Applications = {
  mints: { 551: "0x1606C3211936fE0b596d4230129FAeA00D76A78A" },
  locks: { 8851: "0x1606C3211936fE0b596d4230129FAeA00D76A78A" },
};

interface CrossChainToken {
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
    subnetChainId: 8851,
    parentnetChainId: 551,
    originalToken: "0x1606C3211936fE0b596d4230129FAeA00D76A78A",
    logo: "/vercel.svg",
    mode: 1
  },
];

export const getTokens = (subnetChainId: number | undefined, parentnetChainId: number, bridgeMode: number) => {
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

export const getNetwork = async (rpcName: string, rpcUrl: string) => {
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
  const network = {
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
