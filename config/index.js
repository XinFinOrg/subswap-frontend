import treasuryTokenABI from "../abi/treasuryTokenABI.json";
import lockABI from "../abi/lockABI.json";

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
    fromChainId: 8851,
    toChainId: 551,
    fromChainContract: "0x1606C3211936fE0b596d4230129FAeA00D76A78A",
    logo: "/vercel.svg",
  },
];

const getTokens = (fromChainId, toChainId) => {
  const tokens = [];
  for (const token of crossChainTokens) {
    if (token.fromChainId === fromChainId && token.toChainId === toChainId) {
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
  treasuryTokenABI,
  lockABI,
  getNetwork,
  getTokens,
  getLock,
  getMint,
};
