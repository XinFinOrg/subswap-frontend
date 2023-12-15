import { useState } from "react";
import {
  useNetwork,
  useSwitchNetwork,
  useAccount,
  useContractReads,
} from "wagmi";
import { xdcsubnet, testCoinContract, subnetLockContract } from "@/config";
import WriteButton from "@/components/WriteButton";
import { useGlobalContext } from "@/components/Context";

const Bridge = () => {
  const [render, serRender] = useState(0);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [data, setData] = useState({});
  const { switchNetwork } = useSwitchNetwork();
  const [context, setContext] = useGlobalContext();

  const { data: reads0 } = useContractReads({
    contracts: [
      { ...testCoinContract, functionName: "balanceOf", args: [address] },
      {
        ...testCoinContract,
        functionName: "allowance",
        args: [address, subnetLockContract.address],
      },
    ],
    scopeKey: render,
  });

  const tokenBalance = reads0?.[0]?.result;
  const allowance = reads0?.[1]?.result;

  const approve = {
    buttonName: "Approve",
    data: {
      ...testCoinContract,
      functionName: "approve",
      args: [subnetLockContract.address, 2 ** 254],
    },
    callback: (confirmed) => {
      if (confirmed) {
        serRender(render + 1);
      }
    },
  };

  const send = {
    buttonName: "Send",
    data: {
      ...subnetLockContract,
      functionName: "lock",
      args: [testCoinContract.address, data.amount * 1e18],
    },
    callback: (confirmed) => {
      if (confirmed) {
        serRender(render + 1);
      }
    },
  };

  const getTestCoin = {
    buttonName: "get test coin",
    data: {
      ...testCoinContract,
      functionName: "mint",
      args: [address, "1000000000000000000000000"],
    },
    callback: (confirmed) => {
      if (confirmed) {
        serRender(render + 1);
      }
    },
  };

  let showApprove = false;
  if (allowance < data.amount * 1e18) {
    showApprove = true;
  }

  const submitRpcUrl = async (rpcName, rpcUrl) => {
    if (!rpcName) {
      alert("rpc name is required");
      return;
    }
    if (!rpcUrl) {
      alert("rpc url is required");
      return;
    }
    const res = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_chainId",
        params: [],
        id: 1,
      }),
    });

    const json = await res.json();
    const chainId = Number(json.result);

    const fromNetwork = {
      id: chainId,
      name: rpcName,
      network: rpcName,
      nativeCurrency: {
        decimals: 18,
        name: "XDC",
        symbol: "XDC",
      },
      rpcUrls: {
        public: { http: [rpcUrl] },
        default: { http: [rpcUrl] },
      },
    };
    context.rpcs.push(fromNetwork);
    setContext({
      ...context,
    });
    setData({ ...data, fromNetwork: fromNetwork, customizeNetwork: false });
  };

  return (
    <>
      {
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
                          customizeNetwork: !data.customizeNetwork,
                        });
                      }}
                    >
                      Add new network
                    </div>
                  )}

                  {data.fromNetwork && chain?.id !== data.fromNetwork.id && (
                    <div
                      className="btn"
                      onClick={() => {
                        switchNetwork?.(data.fromNetwork.id);
                      }}
                    >
                      Swith to {data.fromNetwork.name}
                    </div>
                  )}
                  <div>
                    Balance : {tokenBalance?.toString() / 1e18 || 0}{" "}
                    {data.token} <WriteButton {...getTestCoin} />
                  </div>
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

              <input
                type="number"
                placeholder="0"
                className="input input-bordered w-full mt-10"
                onChange={(e) => {
                  setData({ ...data, amount: e.target.value });
                }}
              />
            </div>

            <div className="text-center">
              You will receive {data.amount || 0} ({data.token}) in XDC Mainnet
            </div>

            {showApprove ? (
              <WriteButton {...approve} className="m-auto my-4" />
            ) : (
              <WriteButton {...send} className="m-auto my-4" />
            )}
          </div>
        </>
      }
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
            className="input input-bordered w-full max-w-xs"
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
                  customizeNetwork: !data.customizeNetwork,
                });
              }}
            >
              Close!
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Bridge;
