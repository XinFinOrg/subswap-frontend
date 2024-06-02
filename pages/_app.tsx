import { useState } from "react";
import {
  getDefaultWallets,
  Locale,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { Chain, configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import "@rainbow-me/rainbowkit/styles.css";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { xdcParentNet } from "@/config";
import Layout from "@/components/Layout";
import { ContextProvider } from "@/context";
import "@/styles/globals.css";
import { ThemeContextProvider } from "../context/ThemeContext";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: any) {
  const [context, setContext] = useState<{ rpcs: Chain[] }>({
    rpcs: [xdcParentNet],
  });

  const { chains, publicClient } = configureChains(context.rpcs, [
    publicProvider(),
  ]);

  const { wallets } = getDefaultWallets({
    appName: "Project",
    chains,
    projectId: "2a612b9a18e81ce3fda2f82787eb6a4a",
  });

  const connectors = connectorsForWallets([...wallets]);

  // const connectors = connectorsForWallets([
  //   {
  //     groupName: "Recommended",
  //     wallets: [
  //       metaMaskWallet({
  //         chains,
  //         projectId: "2a612b9a18e81ce3fda2f82787eb6a4a",
  //       }),
  //     ],
  //   },
  // ]);

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
  const { locale } = useRouter();
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider locale={locale as Locale} {...rainbowKitConfig}>
        <ContextProvider state={[context, setContext]}>
          <ThemeContextProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeContextProvider>
        </ContextProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
