import tokenABI from "../abi/tokenABI.json";
import lockABI from "../abi/lockABI.json";
import mintABI from "../abi/mintABI.json";
const xdcparentnet = {
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

const applications = {
  mints: { 551: "0x1606C3211936fE0b596d4230129FAeA00D76A78A" },
  locks: { 8851: "0x1606C3211936fE0b596d4230129FAeA00D76A78A" },
};

const crossChainTokens = [
  {
    name: "Token A",
    subnetChainId: 8851,
    parentnetChainId: 551,
    originalToken: "0x1606C3211936fE0b596d4230129FAeA00D76A78A",
    logo: "/vercel.svg",
    mode: "1", // 1 only subnet to parentnet, 2 only parentnet to subnet, 3 both
  },
];

const getTokens = (subnetChainId, parentnetChainId, bridgeMode) => {
  const tokens = [];
  for (const token of crossChainTokens) {
    if (
      token.subnetChainId === subnetChainId &&
      token.parentnetChainId === parentnetChainId &&
      (token.mode == 3 || bridgeMode == token.mode)
    ) {
      tokens.push(token);
    }
  }
  return tokens;
};

const getLock = (chainId) => {
  return applications.locks[chainId];
};

const getMint = (chainId) => {
  return applications.mints[chainId];
};

const getNetwork = async (rpcName, rpcUrl) => {
  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_chainId",
      params: [],
      id: 1,
    }),
  });

  const json = await res.json();
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

module.exports = {
  xdcparentnet,
  tokenABI,
  lockABI,
  mintABI,
  getNetwork,
  getTokens,
  getLock,
  getMint,
};
