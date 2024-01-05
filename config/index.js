import treasuryTokenABI from "../abi/treasuryTokenABI.json";
import lockABI from "../abi/lockABI.json";

const xdcdevnet = {
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

module.exports = {
  xdcdevnet,
  treasuryTokenABI,
  lockABI,
  getTokens,
  getLock,
  getMint,
};
