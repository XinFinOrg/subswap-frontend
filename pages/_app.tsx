import { useState } from "react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Chain, configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import "@rainbow-me/rainbowkit/styles.css";

import { xdcParentNet } from "@/config";
import Layout from "@/components/Layout";
import { ContextProvider } from "@/components/Context";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: any) {
  const [context, setContext] = useState<{ rpcs: Chain[]; }>({
    rpcs: [xdcParentNet]
  });

  const { chains, publicClient } = configureChains(context.rpcs, [
    publicProvider()
  ]);

  const { connectors } = getDefaultWallets({
    appName: "App",
    projectId: "2a612b9a18e81ce3fda2f82787eb6a4a",
    chains
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
  });

  const rainbowKitConfig = {
    chains: chains,
    showRecentTransactions: true,
    coolMode: true
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
