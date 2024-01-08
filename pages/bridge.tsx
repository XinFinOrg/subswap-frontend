import { useEffect, useState } from "react";
import {
  useNetwork,
  useSwitchNetwork,
  useAccount,
  useContractReads
} from "wagmi";
import { useRouter } from "next/router";

import {
  xdcparentnet,
  getTokens,
  tokenABI,
  getLock,
  getMint,
  lockABI,
  mintABI,
  getNetwork,
  NetworkConfig
} from "@/config";
import { useGlobalContext } from "@/components/Context";
import WriteButton from "@/components/WriteButton";

const Bridge = () => {
  const [_mounted, setMounted] = useState(false);
  const router = useRouter();

  const { rpcUrl, rpcName } = router.query;

  useEffect(() => {
    async function fetchData() {
      if (rpcUrl && rpcName) {
        if (Array.isArray(rpcUrl) || Array.isArray(rpcName)) {
          return;
        }

        await submitRpcUrl(rpcName, rpcUrl);
      }

      setData({ ...data, toNetwork: xdcparentnet });
      setMounted(true);
    }
    fetchData();
  }, [rpcUrl, rpcName]);

  const [render, serRender] = useState(0);
  const { address } = useAccount();
  const { chain } = useNetwork();

  interface BridgeData {
    fromNetwork?: NetworkConfig;
    toNetwork?: NetworkConfig;
    customizeNetwork?: any;
    token?: any;
    selectToken?: any;
    amount: number;
    rpcName?: string;
    rpcUrl?: string;
  }

  const [data, setData] = useState<BridgeData>({});
  const { switchNetwork } = useSwitchNetwork();
  const [context, setContext] = useGlobalContext();

  const fromNetwork = data?.fromNetwork;
  const toNetwork = data?.toNetwork;

  const subnet = fromNetwork?.id === xdcparentnet.id ? toNetwork : fromNetwork;

  const bridgeMode = fromNetwork?.id === xdcparentnet.id ? 2 : 1;

  const tokens = getTokens(subnet?.id, xdcparentnet.id, bridgeMode);

  const selectedToken = data?.token;

  const parentnetMint = getMint(xdcparentnet.id);

  const { data: reads0 } = useContractReads({
    contracts: [
      {
        abi: tokenABI,
        address: selectedToken?.originalToken,
        functionName: "balanceOf",
        args: [address]
      },
      {
        abi: tokenABI,
        address: selectedToken?.originalToken,
        functionName: "allowance",
        args: [address]
      },
      {
        abi: mintABI,
        address: parentnetMint,
        functionName: "treasuryMapping",
        args: [subnet?.id, selectedToken?.originalToken]
      }
    ],
    scopeKey: render
  });

  const tokenBalance = reads0?.[0]?.result;
  const allowance = reads0?.[1]?.result as number;
  const parentnetToken = reads0?.[2]?.result;

  let approve;
  let send;

  //subnet to parentnet
  if (bridgeMode == 1) {
    const lock = getLock(fromNetwork?.id);
    const mint = getMint(toNetwork?.id);

    approve = {
      buttonName: "Approve",
      data: {
        abi: tokenABI,
        address: selectedToken?.originalToken,
        functionName: "approve",
        args: [lock, 2 ** 254]
      },
      callback: (confirmed: boolean) => {
        if (confirmed) {
          serRender(render + 1);
        }
      }
    };

    send = {
      buttonName: "Send",
      data: {
        address: lock,
        abi: lockABI,
        functionName: "lock",
        args: [
          toNetwork?.id,
          mint,
          selectedToken?.originalToken,
          data.amount * 1e18,
          address
        ]
      },
      callback: (confirmed: boolean) => {
        if (confirmed) {
          serRender(render + 1);
        }
      }
    };
    //parentnet to subnet
  } else if (bridgeMode == 2) {
    const mint = getMint(fromNetwork?.id);
    const lock = getLock(toNetwork?.id);

    approve = {
      buttonName: "Approve",
      data: {
        abi: tokenABI,
        address: parentnetToken,
        functionName: "approve",
        args: [mint, 2 ** 254]
      },
      callback: (confirmed: boolean) => {
        if (confirmed) {
          serRender(render + 1);
        }
      }
    };

    send = {
      buttonName: "Send",
      data: {
        address: mint,
        abi: mintABI,
        functionName: "burn",
        args: [
          toNetwork?.id,
          lock,
          selectedToken?.originalToken,
          parentnetToken,
          data.amount * 1e18,
          address
        ]
      },

      callback: (confirmed: boolean) => {
        if (confirmed) {
          serRender(render + 1);
        }
      }
    };
  }

  const getTestCoin = {
    buttonName: "get test coin",
    data: {
      abi: tokenABI,
      address: selectedToken?.originalToken,
      functionName: "mint",
      args: [address, "1000000000000000000000000"]
    },
    callback: (confirmed: boolean) => {
      if (confirmed) {
        serRender(render + 1);
      }
    }
  };

  let showApprove = false;
  if (allowance < data.amount * 1e18) {
    showApprove = true;
  }

  const submitRpcUrl = async (rpcName: string | undefined, rpcUrl: string | undefined) => {
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

  const tokenBalanceReads = tokens?.map((token) => {
    return {
      abi: tokenABI,
      address: token.originalToken,
      functionName: "balanceOf",
      args: [address]
    };
  });
  const tokenDecimalsReads = tokens?.map((token) => {
    return {
      abi: tokenABI,
      address: token.originalToken,
      functionName: "decimals"
    };
  });

  const { data: reads1 } = useContractReads({
    contracts: tokenBalanceReads,
    scopeKey: render
  });

  const { data: reads2 } = useContractReads({
    contracts: tokenDecimalsReads,
    scopeKey: render
  });

  const tokenBalances = tokens?.map((token, index) => {
    return {
      ...token,
      balance: reads1?.[index]?.result,
      decimals: reads2?.[index]?.result
    };
  });

  return (
    <>
      <div className="mt-8 w-96 md:w-1/2 card m-auto shadow-2xl">
        <div className="card-body">
          <div className="flex gap-8">
            <div className="w-full">
              <div className="text-center">from</div>
              {data.fromNetwork ? (
                <select className="select select-bordered w-full mt-2">
                  <option disabled selected>
                    {data.fromNetwork.name}
                  </option>
                </select>
              ) : (
                <div
                  className="btn btn-success w-full mt-2"
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
            </div>
            {">"}
            <div className="w-full">
              <div className="text-center">to</div>
              <select className="select select-bordered w-full mt-2">
                <option disabled selected>
                  Mainnet
                </option>
              </select>
            </div>
          </div>

          <div
            className="btn btn-success w-max mt-10"
            onClick={() => {
              setData({ ...data, selectToken: !data.selectToken });
            }}
          >
            {data.token ? data.token?.name : "Select a token"}
          </div>
          <input
            type="number"
            placeholder="0"
            className="input input-bordered w-full"
            onChange={(e) => {
              setData({ ...data, amount: Number(e.target.value) });
            }}
          />
          <div className="text-right">
            Balance : {Number(tokenBalance ?? 0) / 1e18 || 0} {data.token?.name}{" "}
            <WriteButton {...getTestCoin} />
          </div>
        </div>

        <div className="text-center">
          You will receive {data.amount || 0} ({data.token?.name}) in XDC
          Mainnet
        </div>

        {showApprove ? (
          <WriteButton {...approve} className="m-auto my-4" />
        ) : (
          <WriteButton {...send} className="m-auto my-4" />
        )}
      </div>

      <div className="text-center my-2">Powered by XDC Zero</div>
      {/* Put this part before </body> tag */}
      <input
        type="checkbox"
        className="modal-toggle"
        checked={data?.customizeNetwork}
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add new network</h3>
          <input
            type="text"
            placeholder="rpc name"
            className="input input-bordered w-full max-w-xs"
            onChange={(e) => {
              setData({ ...data, rpcName: e.target.value });
            }}
          />
          <input
            type="text"
            placeholder="rpc endpoint url"
            className="input input-bordered w-full max-w-xs mt-2"
            onChange={(e) => {
              setData({ ...data, rpcUrl: e.target.value });
            }}
          />
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
              Close!
            </label>
          </div>
        </div>
      </div>

      {/* Put this part before </body> tag */}
      <input
        type="checkbox"
        className="modal-toggle"
        checked={data?.selectToken}
      />
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
            <div className="btn btn-success" onClick={async () => {}}>
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
    </>
  );
};

export default Bridge;
