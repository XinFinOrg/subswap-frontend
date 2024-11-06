import { Chain } from "wagmi";

export { default as tokenABI } from "./abi/tokenABI.json";
export { default as lockABI } from "./abi/lockABI.json";
export { default as mintABI } from "./abi/mintABI.json";

//devnet
// const parentnet = {
//   chainid: 551,
//   url: "https://devnetstats.apothem.network/devnet",
// };

// testnet
const parentnet = {
  chainid: 51,
  url: "https://erpc.apothem.network/",
};

//mainnet
// const parentnet = {
//   chainid: 50,
//   url: "https://rpc.xinfin.network",
// };

const subnet = {
  chainid: 953,
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

const applications: Applications = {
  mints: { [parentnet.chainid]: "0x12f70272413eD247B1AEE55bf3e96f0f188b8749" },
  locks: { [subnet.chainid]: "0x24b6A8dE05DD19eDE107606aE8BE252f9600Ead9" },
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
    subnetChainId: subnet.chainid,
    parentnetChainId: parentnet.chainid,
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
