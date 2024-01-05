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

const crossChainTokens = [
  {
    name: "Token A",
    fromChainId: 8851,
    toChainId: 551,
    sua: "0x1606C3211936fE0b596d4230129FAeA00D76A78A",
    rua: "0xeDAAAC4C676181449bC5CAE8EA61Be9D91d207c8",
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

const lockContract = {
  address: "0xb287BA18fe513eb04ba7D2B605C22Dd12d100480",
  abi: lockABI,
};

module.exports = {
  xdcdevnet,
  lockContract,
  treasuryTokenABI,
  getTokens,
};
