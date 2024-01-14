import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  useNetwork,
  useSwitchNetwork,
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
  CrossChainToken
} from "@/config";
import { useGlobalContext } from "@/components/Context";
import SubmitButton from "@/components/SubmitButton";
import RightArrow from "@/components/RightArrow";
import { LiaExchangeAltSolid } from "react-icons/lia";

const tokenABI = rawTokenABI as OperationObject.Data.Abi;

interface BridgeData {
  fromNetwork?: Chain;
  toNetwork?: Chain;
  customizeNetwork?: boolean;
  token?: any;
  selectToken?: any;
  amount?: number;
  rpcName?: string;
  rpcUrl?: string;
}

interface OperationObject {
  buttonName: OperationObject.ButtonName;
  data: OperationObject.Data;
  callback: (confirmed: boolean) => void;
}

namespace OperationObject {
  export type ButtonName = 'Approve' | 'Send';
  export interface Data {
    abi: Data.Abi;
    address: string | undefined;
    functionName: Data.FunctionName;
    args?: Data.Args;
  };

  export namespace Data {
    export type Abi = any;
    export type FunctionName = 'approve' | 'lock' | 'burn' | 'balanceOf' | 'decimals';
    export type Args = Array<number | string | undefined>;
  }
}

const Bridge = () => {
  const [data, setData] = useState<BridgeData>({});
  const [render, serRender] = useState(0);

  const router = useRouter();
  const { address } = useAccount();
  const [context, setContext] = useGlobalContext();

  const { rpcUrl, rpcName } = router.query;

  // When query changed, we get network from query 
  useEffect(() => {
    async function fetchData() {
      if (rpcUrl && rpcName) {
        if (Array.isArray(rpcUrl) || Array.isArray(rpcName)) {
          return;
        }

        await submitRpcUrl(rpcName, rpcUrl);
      }

      setData({ ...data, toNetwork: xdcparentnet });
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rpcUrl, rpcName]);

  const fromNetwork = data?.fromNetwork;
  const toNetwork = data?.toNetwork;

  const subnet = fromNetwork?.id === xdcparentnet.id ? toNetwork : fromNetwork;
  const bridgeMode = fromNetwork?.id === xdcparentnet.id ? 2 : 1;
  const tokens = getTokens(subnet?.id, xdcparentnet.id, bridgeMode);
  const selectedToken = data?.token;

  // TODO: Specify what reads0 is
  const { tokenBalance, allowance, parentnetToken } = useGetReads0(selectedToken, address, subnet, xdcparentnet.id, render);
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
      approve = createOperationObject("Approve", createOperationData(tokenABI, selectedToken?.originalToken, "approve", [lock, 2 ** 254]), commonCallback);
      send = createOperationObject("Send", createOperationData(lockABI, lock, "lock", [toNetwork?.id, mint, selectedToken?.originalToken, data.amount ?? 0 * 1e18, address]), commonCallback);
    } else if (bridgeMode == 2) {
      approve = createOperationObject("Approve", createOperationData(tokenABI, parentnetToken, "approve", [mint, 2 ** 254]), commonCallback);
      send = createOperationObject("Send", createOperationData(mintABI, mint, "burn", [toNetwork?.id, lock, selectedToken?.originalToken, parentnetToken, data.amount ?? 0 * 1e18, address]), commonCallback);
    } else {
      throw new Error("Invalid bridge mode");
    }

    return { approve, send };
  }

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

  const showApprove = allowance < (data.amount ?? 0) * 1e18;

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
    context.rpcs.push(fromNetwork);
    setContext({
      ...context
    });
    setData({ ...data, fromNetwork: fromNetwork, customizeNetwork: false });
  };

  return (
    <>
      <div className="mt-8 w-[568px] max-sm:w-11/12 card mx-auto shadow-dialog bg-black-2">
        <div className="card-title pl-8 pt-8 text-3xl text-card-title">
          Bridge
        </div>

        <div className="card-body">
          <SourceTargetSelect data={data} setData={setData} tokenBalance={tokenBalance} />
          <TokenSelect data={data} setData={setData} />
          <input
            type="number"
            placeholder="0"
            className="input input-bordered w-full"
            onChange={(e) => {
              setData({ ...data, amount: Number(e.target.value) });
            }}
          />
          {/* <div className="text-right mt-2">
            <SubmitButton {...getTestCoin} />
          </div>

          <div className="text-center">
            You will receive {data.amount || 0} ({data.token?.name}) in XDC
            Mainnet
          </div> */}

          {showApprove ? (
            <SubmitButton {...approve} className="m-auto my-4" />
          ) : (
            <SubmitButton {...send} className="m-auto my-4" />
          )}
          <div className="text-center my-2">Powered by XDC-Zero</div>
        </div>

        {/* Note: No idea what this does, please check */}
        {/* Put this part before </body> tag */}
        <input
          type="checkbox"
          className="modal-toggle"
          checked={data?.customizeNetwork}
        />
      </div>

      {/* Dialog to add network */}
      <AddNetWorkDialog setData={setData} data={data} submitRpcUrl={submitRpcUrl} />

      {/* Note: No idea what this does, please check */}
      {/* Put this part before </body> tag */}
      <input
        id="test"
        type="checkbox"
        className="modal-toggle"
        checked={data?.selectToken}
      />

      {/* Dialog to select token */}
      <SelectTokenDialog setData={setData} data={data} tokens={tokens} address={address} render={render} />
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
    scopeKey: render.toString(),
  });

  const tokenBalance = data?.[0]?.result;
  const allowance = data?.[1]?.result as number;
  const parentnetToken = data?.[2]?.result as any;

  return { tokenBalance, allowance, parentnetToken };
};

const useGetReads1 = (tokens: CrossChainToken[], address: string | undefined, render: number) => {
  const tokenBalanceReads = tokens?.map<OperationObject.Data>(token => {
    return {
      abi: tokenABI,
      address: token.originalToken,
      functionName: "balanceOf",
      args: [address]
    };
  });

  const { data } = useContractReads({
    contracts: tokenBalanceReads as any,
    scopeKey: render.toString()
  });

  return data;
};

const useGetTokenBalances = (tokens: CrossChainToken[], address: string | undefined, render: number) => {
  const reads1 = useGetReads1(tokens, address, render);
  const tokenDecimalsReads = tokens?.map<OperationObject.Data>(token => {
    return {
      abi: tokenABI,
      address: token.originalToken,
      functionName: "decimals"
    };
  });

  const { data: reads2 } = useContractReads({
    contracts: tokenDecimalsReads as any,
    scopeKey: render.toString()
  });

  return tokens?.map((token, index) => {
    return {
      ...token,
      balance: reads1?.[index]?.result,
      decimals: reads2?.[index]?.result
    };
  });
};

// Components for bridge page
type AddNetWorkDialogProps = {
  setData: Dispatch<SetStateAction<BridgeData>>;
  data: BridgeData;
  submitRpcUrl: (rpcName: string | undefined, rpcUrl: string | undefined) => Promise<void>;
};

type SelectTokenDialogProps = {
  setData: Dispatch<SetStateAction<BridgeData>>;
  data: BridgeData;
  address: string | undefined;
  render: number;
  tokens: CrossChainToken[];
};

function SelectTokenDialog({ data, setData, address, render, tokens }: SelectTokenDialogProps) {
  const tokenBalances = useGetTokenBalances(tokens, address, render);

  return (
    <div className="modal" role="dialog">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Select a token</h3>
        {tokenBalances?.map((token, index) => {
          return (
            <div
              key={index}
              className="card cursor-pointer"
              onClick={() => {
                setData({
                  ...data,
                  token: token,
                  selectToken: !data.selectToken
                });
              }}
            >
              <div className="card-body">
                <div>
                  <div className="float-left">{token.name}</div>
                  <div className="float-right">
                    {/* (token.balance) / 10n ** token.decimals */}
                    <>{token.balance ?? 0}</>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="modal-action">
          <div className="btn btn-success" onClick={async () => { }}>
            Select
          </div>

          <label
            className="btn"
            onClick={() => {
              setData({
                ...data,
                selectToken: !data.selectToken
              });
            }}
          >
            Close
          </label>
        </div>
      </div>
    </div>
  );
}

function AddNetWorkDialog({ setData, data, submitRpcUrl }: AddNetWorkDialogProps) {
  return (
    <div className="modal" role="dialog">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add new network</h3>
        <input
          type="text"
          placeholder="rpc name"
          className="input input-bordered w-full max-w-xs"
          onChange={(e) => {
            setData({ ...data, rpcName: e.target.value });
          }} />
        <input
          type="text"
          placeholder="rpc endpoint url"
          className="input input-bordered w-full max-w-xs mt-2"
          onChange={(e) => {
            setData({ ...data, rpcUrl: e.target.value });
          }} />
        <div className="modal-action">
          <div
            className="btn btn-success"
            onClick={async () => {
              await submitRpcUrl(data.rpcName, data.rpcUrl);
            }}
          >
            Add
          </div>
          <label
            className="btn"
            onClick={() => {
              setData({
                ...data,
                customizeNetwork: !data.customizeNetwork
              });
            }}
          >
            Close
          </label>
        </div>
      </div>
    </div>
  );
}

type SelectTokenProps = {
  data: BridgeData;
  setData: Dispatch<SetStateAction<BridgeData>>;
};

function TokenSelect({ data, setData }: SelectTokenProps) {
  return <div
    className="btn btn-success w-max mt-10"
    onClick={() => {
      setData({ ...data, selectToken: !data.selectToken });
    }}
  >
    {data.token ? data.token?.name : "Select a token"}
  </div>;
}

type SourceTargetSelectProps = {
  data: BridgeData;
  setData: Dispatch<SetStateAction<BridgeData>>;
  tokenBalance: any;
};

function SourceTargetSelect({ data, setData, tokenBalance }: SourceTargetSelectProps) {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  return (
    <div className="flex border p-4 border-border rounded-3xl items-center">
      <div className="w-full">
        {/* From -> */}
        <div className="flex items-center">
          <div className="font-bold text-light-grey text-sm">From</div>
          <div className="ml-3">
            <RightArrow />
          </div>
        </div>

        {/* Select ? */}
        {/* TODO: use selected if there is one in local storage, but this should still able to change/add new network */}
        {data.fromNetwork ? (
          <select className="select select-bordered w-full mt-2 bg-light/10 rounded-3xl">
            <option disabled selected>
              {data.fromNetwork.name}
            </option>
          </select>
        ) : (
          <div
            className="btn rounded-3xl w-full mt-2 bg-light/10 text-primary"
            onClick={() => {
              setData({
                ...data,
                customizeNetwork: !data.customizeNetwork
              });
            }}
          >
            Add new network
          </div>
        )}

        {data.fromNetwork && chain?.id !== data.fromNetwork.id && (
          <button
            className="btn"
            onClick={() => {
              switchNetwork?.(data.fromNetwork?.id);
            }}
            disabled={!data.fromNetwork}
          >
            Switch to {data.fromNetwork.name}
          </button>
        )}
        <button className="mt-2 px-2.5 py-1.5 text-sm text-bold text-primary bg-button-bg rounded-3xl">
          Switch
        </button>
      </div>

      <div className="bg-light/10 p-1 rounded-full mx-2 -mt-2">
        <LiaExchangeAltSolid size="16" color="white" />
      </div>

      {/* -> To */}
      <div className="w-full">
        <div className="flex items-center">
          <RightArrow />
          <div className="ml-3 font-bold text-light-grey text-sm">To</div>
        </div>
        <select className="select select-bordered w-full mt-2 rounded-3xl">
          <option disabled selected>
            Mainnet
          </option>
        </select>
        <div className="mt-3 ml-2 text-light-grey font-light text-sm h-6">
          Balance: {Number(tokenBalance ?? 0) / 1e18 || 0}
          {data.token?.name}{" "}
        </div>
      </div>
    </div>
  );
}