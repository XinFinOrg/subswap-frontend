import React, { useEffect, useState } from "react";
import { useAccount, useContractReads, Chain, useChainId } from "wagmi";
import { useRouter } from "next/router";

import {
  xdcParentNet,
  getTokens,
  tokenABI as rawTokenABI,
  getLock,
  getMint,
  lockABI,
  mintABI,
  getNetwork,
} from "@/config";
import { useGlobalContext } from "@/context";
import { NetworkSelect } from "../components/Bridge/NetworkSelect";
import { ConnectWallet } from "../components/Bridge/ConnectWallet";
import { TokenSelect } from "../components/Bridge/TokenSelect";
import { BridgeContent } from "../components/Bridge/BridgeContent";
import CardTitle from "../components/Bridge/CardTitle";
import Spinner from "../components/Spinner/Spinner";
import SubmitButton from "@/components/SubmitButton";

const tokenABI = rawTokenABI as OperationObject.Data.Abi;

export interface BridgeViewData {
  fromNetwork?: Chain;
  toNetwork?: Chain;
  customizeNetwork?: boolean;
  token?: any;
  selectToken?: any;
  amount?: number;
  rpcName?: string;
  rpcUrl?: string;
}

export interface OperationObject {
  buttonName: OperationObject.ButtonName;
  data: OperationObject.Data;
  callback: (confirmed: boolean) => void;
}

export namespace OperationObject {
  export type ButtonName = "Approve" | "Send" | "Get test coin";
  export interface Data {
    abi: Data.Abi;
    address: string | undefined;
    functionName: Data.FunctionName;
    args?: Data.Args;
  }

  export namespace Data {
    export type Abi = any;
    export type FunctionName =
      | "approve"
      | "lock"
      | "burn"
      | "balanceOf"
      | "decimals";
    export type Args = Array<number | string | undefined>;
  }
}

export type NetworkInfo = {
  name: string;
  rpcUrl: string;
};

const Bridge = () => {
  // Show the select network UI in the card content area
  const [showSelectNetwork, setShowSelectNetwork] = useState(false);
  const [showSelectToken, setShowSelectToken] = useState(false);
  const [bridgeViewData, setBridgeViewData] = useState<BridgeViewData>({
    toNetwork: xdcParentNet,
  });
  const [render, serRender] = useState(0);
  const [storedNetworks, setStoredNetworks] = useState<NetworkInfo[]>([]);
  const [toAddress, setToAddress] = useState<string>();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [context, setContext] = useGlobalContext();
  const chainId = useChainId();

  const { rpcUrl, rpcName } = router.query;

  useEffect(() => {
    setIsWalletConnected(isConnected);
  }, [isConnected]);

  // Load existing data from localStorage when component mounts
  useEffect(() => {
    async function setDefaultDataFromLocalStorage() {
      try {
        setIsLoading(true);
        const networks = localStorage.getItem("networks");
        const parsedNetworks = networks ? JSON.parse(networks) : [];
        setStoredNetworks(parsedNetworks);

        const selectedNetworkInfo = localStorage.getItem("selectedNetwork");
        const parsedSelectedNetwork = selectedNetworkInfo
          ? JSON.parse(selectedNetworkInfo)
          : null;

        await submitRpcUrl(
          parsedSelectedNetwork?.name,
          parsedSelectedNetwork?.rpcUrl
        );
      } catch (error) {
        console.error("Error parsing data from localStorage", error);
        setStoredNetworks([]);
      } finally {
        setIsLoading(false);
      }
    }

    setDefaultDataFromLocalStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When query changed, we get network from query
  useEffect(() => {
    async function fetchData() {
      try {
        if (rpcUrl && rpcName) {
          if (Array.isArray(rpcUrl) || Array.isArray(rpcName)) {
            return;
          }

          await submitRpcUrl(rpcName, rpcUrl);
        }
      } catch (error) {
        alert(error);
        return;
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rpcUrl, rpcName]);

  console.log(bridgeViewData);
  const fromNetwork = bridgeViewData?.fromNetwork;
  const toNetwork = bridgeViewData?.toNetwork;

  const subnet = fromNetwork?.id === xdcParentNet.id ? toNetwork : fromNetwork;
  const bridgeMode = fromNetwork?.id === xdcParentNet.id ? 2 : 1;
  const tokens = getTokens(subnet?.id, xdcParentNet.id, bridgeMode);
  const selectedToken = bridgeViewData?.token;

  const isCurrentNetwork = fromNetwork?.id === chainId;

  console.log(isCurrentNetwork);

  const { tokenBalance, allowance, parentnetToken } = useGetTokenDetails(
    selectedToken,
    address,
    subnet,
    xdcParentNet.id,
    render
  );

  const { approve, send } = handleTokenOperations();

  function createOperationObject(
    buttonName: OperationObject.ButtonName,
    data: OperationObject.Data,
    callback: (confirmed: boolean) => void
  ): OperationObject {
    return {
      buttonName,
      data,
      callback,
    };
  }

  function commonCallback(confirmed: boolean) {
    if (confirmed) {
      serRender(render + 1);
    }
  }

  function createOperationData(
    abi: OperationObject.Data.Abi,
    address: string | undefined,
    functionName: OperationObject.Data.FunctionName,
    args: OperationObject.Data.Args
  ): OperationObject.Data {
    return { abi, address, functionName, args };
  }

  function handleTokenOperations() {
    let approve: OperationObject;
    let send: OperationObject;

    // Common lock and mint calculations

    const lock = getLock(bridgeMode == 1 ? fromNetwork?.id : toNetwork?.id);
    const mint = getMint(bridgeMode == 1 ? toNetwork?.id : fromNetwork?.id);

    if (bridgeMode == 1) {
      approve = createOperationObject(
        "Approve",
        createOperationData(tokenABI, selectedToken?.originalToken, "approve", [
          lock,
          2 ** 254,
        ]),
        commonCallback
      );
      console.log(
        toNetwork?.id,
        mint,
        selectedToken?.originalToken,
        (Number(bridgeViewData.amount) ?? 0) * 1e18,
        toAddress || address
      );
      send = createOperationObject(
        "Send",
        createOperationData(lockABI, lock, "lock", [
          toNetwork?.id,
          mint,
          selectedToken?.originalToken,
          (Number(bridgeViewData.amount) ?? 0) * 1e18,
          toAddress || address,
        ]),
        commonCallback
      );
    } else if (bridgeMode == 2) {
      approve = createOperationObject(
        "Approve",
        createOperationData(tokenABI, parentnetToken, "approve", [
          mint,
          2 ** 254,
        ]),
        commonCallback
      );
      send = createOperationObject(
        "Send",
        createOperationData(mintABI, mint, "burn", [
          toNetwork?.id,
          lock,
          selectedToken?.originalToken,
          parentnetToken,
          Number(bridgeViewData.amount) ?? 0 * 1e18,
          toAddress || address,
        ]),
        commonCallback
      );
    } else {
      throw new Error("Invalid bridge mode");
    }

    return { approve, send };
  }

  // content can be one of these, in order.
  // 1. connect wallet
  // 2. select network
  // 3. select token
  // 4. bridge function
  function getCardContent() {
    let cardTitle: string;
    let cardBodyContent: JSX.Element;
    let showGoBackIcon = false;

    if (!isWalletConnected) {
      cardTitle = "Bridge";
      cardBodyContent = <ConnectWallet />;
    } else if (showSelectNetwork) {
      cardTitle = "Networks";
      cardBodyContent = (
        <NetworkSelect
          submitRpcUrl={submitRpcUrl}
          bridgeViewData={bridgeViewData}
          setBridgeViewData={setBridgeViewData}
          storedNetworks={storedNetworks ?? []}
          setStoredNetworks={setStoredNetworks}
        />
      );
      showGoBackIcon = true;
    } else if (showSelectToken) {
      cardTitle = "Select Token";
      cardBodyContent = (
        <TokenSelect
          tokens={tokens}
          address={address}
          render={render}
          bridgeViewData={bridgeViewData}
          setBridgeViewData={setBridgeViewData}
        />
      );
      showGoBackIcon = true;
    } else {
      cardTitle = "Bridge";
      cardBodyContent = (
        <BridgeContent
          bridgeViewData={bridgeViewData}
          setBridgeViewData={setBridgeViewData}
          tokenBalance={tokenBalance}
          showApprove={showApprove}
          approve={approve}
          send={send}
          setShowSelectNetwork={setShowSelectNetwork}
          setShowSelectToken={setShowSelectToken}
          setToAddress={setToAddress}
        />
      );
    }

    return (
      <>
        <CardTitle
          title={cardTitle}
          showGoBackIcon={showGoBackIcon}
          setShowSelectNetwork={setShowSelectNetwork}
          setShowSelectToken={setShowSelectToken}
        />
        <div className="card-body pb-8 gap-8">{cardBodyContent}</div>
        <div className="text-center pb-10 text-sm">Powered by XDCZero</div>
      </>
    );
  }

  const getTestCoin = {
    buttonName: "Get test coin",
    data: {
      abi: tokenABI,
      address: selectedToken?.originalToken,
      functionName: "mint",
      args: [address, "1000000000000000000000000"],
    },
    callback: (confirmed: boolean) => {
      if (confirmed) {
        serRender(render + 1);
      }
    },
  };

  const showApprove = allowance < (Number(bridgeViewData.amount) ?? 0) * 1e18;

  const submitRpcUrl = async (
    rpcName: string | undefined,
    rpcUrl: string | undefined
  ) => {
    try {
      if (!rpcName) {
        alert("rpc name is required");
        return;
      }

      if (!rpcUrl) {
        alert("rpc url is required");
        return;
      }

      const fromNetwork = await getNetwork(rpcName, rpcUrl);

      // push fromNetwork to context rpcs
      context.rpcs.push(fromNetwork);
      setContext({
        ...context,
      });

      // set bridge view data
      setBridgeViewData({
        ...bridgeViewData,
        fromNetwork,
        customizeNetwork: false,
      });
    } catch (error) {
      throw new Error(
        "Fail to get network, please check if the rpc url is valid"
      );
    }
  };

  return (
    <div className="relative">
      {isLoading && <Spinner text="Loading" textSize="md" />}
      <div
        className={`mt-8 w-[568px] max-sm:w-11/12 card mx-auto shadow-dialog bg-white-4 dark:bg-black-2 ${
          isLoading ? "opacity-10" : ""
        }`}
      >
        {getCardContent()}
      </div>

      {/* <SubmitButton {...getTestCoin} /> */}
    </div>
  );
};

export default Bridge;

// hooks
const useGetTokenDetails = (
  selectedToken: any,
  address: string | undefined,
  subnet: Chain | undefined,
  xdcparentnetId: number,
  render: number
) => {
  const parentnetMint = getMint(xdcparentnetId);

  const { data } = useContractReads({
    contracts: [
      {
        abi: tokenABI,
        address: selectedToken?.originalToken,
        functionName: "balanceOf",
        args: [address] as any,
      },
      {
        abi: tokenABI,
        address: selectedToken?.originalToken,
        functionName: "allowance",
        args: [address] as any,
      },
      {
        abi: mintABI,
        address: parentnetMint,
        functionName: "treasuryMapping",
        args: [subnet?.id, selectedToken?.originalToken],
      },
    ],
    scopeKey: render.toString(),
  });

  const tokenBalance = data?.[0]?.result;
  const allowance = data?.[1]?.result as number;
  const parentnetToken = data?.[2]?.result as any;

  return { tokenBalance, allowance, parentnetToken };
};
