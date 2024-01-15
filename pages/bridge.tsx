import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  useAccount,
  useContractReads,
  Chain
} from "wagmi";
import { useRouter } from "next/router";

import {
  xdcparentnet,
  getTokens,
  tokenABI as rawTokenABI,
  getLock,
  getMint,
  lockABI,
  mintABI,
  getNetwork,
} from "@/config";
import { useGlobalContext } from "@/components/Context";
import SubmitButton from "@/components/SubmitButton";
import { GoArrowLeft } from "react-icons/go";
import { NetworkSelect } from '../components/Bridge/NetworkSelect';
import { SourceTargetSelect } from '../components/Bridge/SourceTargetSelect';
import { TokenSelect } from '../components/Bridge/TokenSelect';
import { ConnectWallet } from '../components/Bridge/ConnectWallet';
import { TokenSelectDialog } from '../components/Bridge/TokenSelectDialog';
import { AddNetWorkDialog } from '../components/Bridge/AddNetWorkDialog';
import { Section } from '../components/Bridge/Section';
import { RiArrowDownSLine } from "react-icons/ri";
import Slider from '../components/Slider/Slider';
import RightArrow from '../components/RightArrow';

const tokenABI = rawTokenABI as OperationObject.Data.Abi;

export interface BridgeData {
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
  export type ButtonName = "Approve" | "Send";
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

export type Network = {
  name: string;
  rpcUrl: string;
};

const Bridge = () => {
  const { isConnected } = useAccount();
  const [showSelectNetwork, setShowSelectNetwork] = useState(false);
  const [bridgeViewData, setBridgeViewData] = useState<BridgeData>({});
  const [render, serRender] = useState(0);
  const [selectedNetwork, setSelectedNetwork] = useState<Network>();
  const [storedNetworks, setStoredNetworks] = useState<Network[]>([]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const router = useRouter();
  const { address } = useAccount();
  const [context, setContext] = useGlobalContext();

  const { rpcUrl, rpcName } = router.query;

  useEffect(() => {
    setIsWalletConnected(isConnected);
  }, [isConnected]);

  // Load existing data from localStorage when component mounts
  useEffect(() => {
    let storedNetworks;
    let storedSelectedNetwork;

    try {
      const networks = localStorage.getItem('networks');
      storedNetworks = networks ? JSON.parse(networks) : [];

      const network = localStorage.getItem('selectedNetwork');
      storedSelectedNetwork = network ? JSON.parse(network) : null;
    } catch (error) {
      console.error("Error parsing data from localStorage", error);
      storedNetworks = [];
    }

    setStoredNetworks(storedNetworks);
    setSelectedNetwork(storedSelectedNetwork);
  }, []);

  // When query changed, we get network from query
  useEffect(() => {
    async function fetchData() {
      if (rpcUrl && rpcName) {
        if (Array.isArray(rpcUrl) || Array.isArray(rpcName)) {
          return;
        }

        await submitRpcUrl(rpcName, rpcUrl);
      }

      setBridgeViewData({ ...bridgeViewData, toNetwork: xdcparentnet });
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rpcUrl, rpcName]);

  const fromNetwork = bridgeViewData?.fromNetwork;
  const toNetwork = bridgeViewData?.toNetwork;

  const subnet = fromNetwork?.id === xdcparentnet.id ? toNetwork : fromNetwork;
  const bridgeMode = fromNetwork?.id === xdcparentnet.id ? 2 : 1;
  const tokens = getTokens(subnet?.id, xdcparentnet.id, bridgeMode);
  const selectedToken = bridgeViewData?.token;

  // TODO: Specify what reads0 is
  const { tokenBalance, allowance, parentnetToken } = useGetReads0(
    selectedToken,
    address,
    subnet,
    xdcparentnet.id,
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
      callback
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
          2 ** 254
        ]),
        commonCallback
      );
      send = createOperationObject(
        "Send",
        createOperationData(lockABI, lock, "lock", [
          toNetwork?.id,
          mint,
          selectedToken?.originalToken,
          bridgeViewData.amount ?? 0 * 1e18,
          address
        ]),
        commonCallback
      );
    } else if (bridgeMode == 2) {
      approve = createOperationObject(
        "Approve",
        createOperationData(tokenABI, parentnetToken, "approve", [
          mint,
          2 ** 254
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
          bridgeViewData.amount ?? 0 * 1e18,
          address
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
          selectedNetwork={selectedNetwork}
          storedNetworks={storedNetworks ?? []}
          setSelectedNetwork={setSelectedNetwork}
          setStoredNetworks={setStoredNetworks}
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
          selectedNetwork={selectedNetwork}
          setShowSelectNetwork={setShowSelectNetwork}
        />
      );
    }

    return (
      <>
        <CardTitle title={cardTitle} showGoBackIcon={showGoBackIcon} />
        <div className="card-body pb-8 gap-8">{cardBodyContent}</div>
        <div className="text-center pb-10 text-grey-9 text-sm">Powered by XDC-zero</div>
      </>
    );
  }

  type CardTitleProps = {
    title: string;
    showGoBackIcon?: boolean;
  };

  function CardTitle({ title, showGoBackIcon }: CardTitleProps) {
    return (
      <div className="pl-8 pt-8">
        {showGoBackIcon && (
          <button
            className="w-10 h-10 rounded-full bg-light/10 flex items-center justify-center"
            onClick={() => setShowSelectNetwork(false)}
          >
            <GoArrowLeft color="bg-grey-9/50" size="20" />
          </button>
        )}
        <div className="card-title text-3xl text-grey-9 mt-4">{title}</div>
      </div>
    );
  }

  type CardBodyProps = React.PropsWithChildren;

  // const getTestCoin = {
  //   buttonName: "Get test coin",
  //   data: {
  //     abi: tokenABI,
  //     address: selectedToken?.originalToken,
  //     functionName: "mint",
  //     args: [address, "1000000000000000000000000"]
  //   },
  //   callback: (confirmed: boolean) => {
  //     if (confirmed) {
  //       serRender(render + 1);
  //     }
  //   }
  // };

  const showApprove = allowance < (bridgeViewData.amount ?? 0) * 1e18;

  const submitRpcUrl = async (
    rpcName: string | undefined,
    rpcUrl: string | undefined
  ) => {
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
      ...context
    });

    // set bridge view data
    setBridgeViewData({
      ...bridgeViewData,
      fromNetwork: fromNetwork,
      customizeNetwork: false
    });
  };

  return (
    <>
      <div className="mt-8 w-[568px] max-sm:w-11/12 card mx-auto shadow-dialog bg-black-2">
        {getCardContent()}

        {/* Note: No idea what this does, please check */}
        {/* Put this part before </body> tag */}
        <input
          type="checkbox"
          className="modal-toggle"
          checked={bridgeViewData?.customizeNetwork}
        />
      </div>

      {/* Dialog to add network */}
      <AddNetWorkDialog
        setData={setBridgeViewData}
        data={bridgeViewData}
        submitRpcUrl={submitRpcUrl}
      />

      {/* Note: No idea what this does, please check */}
      {/* Put this part before </body> tag */}
      <input
        id="test"
        type="checkbox"
        className="modal-toggle"
        checked={bridgeViewData?.selectToken}
      />

      {/* Dialog to select token */}
      <TokenSelectDialog
        setData={setBridgeViewData}
        data={bridgeViewData}
        tokens={tokens}
        address={address}
        render={render}
      />
    </>
  );
};

export default Bridge;

// hooks
const useGetReads0 = (
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
        args: [address] as any
      },
      {
        abi: tokenABI,
        address: selectedToken?.originalToken,
        functionName: "allowance",
        args: [address] as any
      },
      {
        abi: mintABI,
        address: parentnetMint,
        functionName: "treasuryMapping",
        args: [subnet?.id, selectedToken?.originalToken]
      }
    ],
    scopeKey: render.toString()
  });

  const tokenBalance = data?.[0]?.result;
  const allowance = data?.[1]?.result as number;
  const parentnetToken = data?.[2]?.result as any;

  return { tokenBalance, allowance, parentnetToken };
};


// Components for bridge page
type BridgeContentProps = {
  bridgeViewData: BridgeData;
  setBridgeViewData: Dispatch<SetStateAction<BridgeData>>;
  tokenBalance: unknown;
  showApprove: boolean;
  approve: OperationObject;
  send: OperationObject;
  selectedNetwork?: Network;
  setShowSelectNetwork: Dispatch<SetStateAction<boolean>>;
};

function BridgeContent({
  bridgeViewData,
  setBridgeViewData,
  tokenBalance,
  showApprove,
  approve,
  send,
  selectedNetwork,
  setShowSelectNetwork
}: BridgeContentProps) {
  return (
    <>
      <SourceTargetSelect
        data={bridgeViewData}
        setData={setBridgeViewData}
        tokenBalance={tokenBalance}
        selectedNetwork={selectedNetwork}
        setShowSelectNetwork={setShowSelectNetwork}
      />

      {selectedNetwork && (
        <>
          <Section>
            <div className='flex flex-col w-full gap-4'>
              <div className='py-3 flex justify-between w-full gap-4 items-center'>
                <div className='flex items-center justify-between grow'>
                  {/* Token select */}
                  <div
                    className="btn rounded-3xl w-40 bg-light/10 text-grey-9 flex"
                  >
                    BitCoin<RiArrowDownSLine size="20" />
                  </div>

                  {/* Selected amount */}
                  <div className="grow text-right text-grey-9">{bridgeViewData.amount}</div>
                </div>

                {/* Max button */}
                <button className='rounded-full bg-grey-9/10 py-2 px-4 h-10 text-primary'>Max</button>
              </div>
              <Slider min={0} max={100} onChange={amount => {
                setBridgeViewData({
                  ...bridgeViewData,
                  amount
                });
              }} />
              <div className='self-end pr-1'>
                Balance: {Number(tokenBalance ?? 0) / 1e18 || 0}
              </div>
            </div>
          </Section>
          <Section>
            <div className='flex flex-col w-full'>
              <div className="flex items-center">
                <div className="font-bold text-light-grey text-sm">To address</div>
                <div className="ml-3">
                  <RightArrow />
                </div>
              </div>
              <div className='mt-2'>
                <input
                  type="text"
                  placeholder="Enter address"
                  className="w-full rounded-full bg-grey-9/10 p-4"
                  onChange={(e) => {
                    // TODO: check valid address and set address to state
                  }}
                />
              </div>
            </div>
          </Section>
          <div>
            <div className='flex justify-between'>
              <p>You will receive</p>
              <p className='text-right'>XXX token A in mainnet</p>
            </div>
            <div className='flex justify-between mt-2'>
              <p>Fee</p>
              <p className='text-right'>XXX USD</p>
            </div>
          </div>
        </>
      )}

      {/* <TokenSelect data={bridgeViewData} setData={setBridgeViewData} />
      <input
        type="number"
        placeholder="0"
        className="input input-bordered w-full"
        onChange={(e) => {
          setBridgeViewData({
            ...bridgeViewData,
            amount: Number(e.target.value)
          });
        }}
      /> */}
      {/* <div className="text-right mt-2">
          <SubmitButton {...getTestCoin} />
        </div>

        <div className="text-center">
          You will receive {data.amount || 0} ({data.token?.name}) in XDC
          Mainnet
        </div> */}

      {showApprove ? (
        <SubmitButton {...approve} />
      ) : (
        <SubmitButton {...send} />
      )}
    </>
  );
}

