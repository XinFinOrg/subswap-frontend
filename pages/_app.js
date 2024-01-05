import "@/styles/globals.css";
import Layout from "../components/Layout";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";

import { publicProvider } from "wagmi/providers/public";
import { xdcparentnet } from "@/config";
import { useEffect, useState } from "react";
import { useGlobalContext } from "@/components/Context";
import { ContextProvider } from "@/components/Context";

export default function App({ Component, pageProps }) {
  const [context, setContext] = useState({ rpcs: [xdcparentnet] });

  const { chains, publicClient } = configureChains(context.rpcs, [
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
        <ContextProvider state={[context, setContext]}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ContextProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
