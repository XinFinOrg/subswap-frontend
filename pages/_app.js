import "@/styles/globals.css";
import Layout from "../components/Layout";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";

import { publicProvider } from "wagmi/providers/public";
import { xdcdevnet, xdcsubnet } from "@/config";
import { useState } from "react";

export default function App({ Component, pageProps }) {
  const [data, setData] = useState({ chainsUrls: [xdcdevnet, xdcsubnet] });

  const { chains, publicClient } = configureChains(data.chainsUrls, [
    publicProvider(),
  ]);
  const { connectors } = getDefaultWallets({
    appName: "App",
    projectId: "2a612b9a18e81ce3fda2f82787eb6a4a",
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });
  const rainbowKitConfig = {
    chains: chains,
    showRecentTransactions: true,
    coolMode: true,
  };

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider {...rainbowKitConfig}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
