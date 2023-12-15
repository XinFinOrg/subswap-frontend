import { useState } from "react";
import {
  useNetwork,
  useSwitchNetwork,
  useAccount,
  useContractReads,
} from "wagmi";
import { xdcsubnet, testCoinContract, subnetLockContract } from "@/config";
import WriteButton from "@/components/WriteButton";

const Bridge = () => {
  const [render, serRender] = useState(0);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [data, setData] = useState({});
  const { switchNetwork } = useSwitchNetwork();

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

  console.log(reads0);

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
  return (
    <>
      {
        <>
          <div className="mt-8 w-96 md:w-1/2 card m-auto shadow-2xl">
            <div className="card-body">
              <div className="flex gap-8">
                <div className="w-full">
                  <div className="text-center">from</div>
                  <select className="select select-bordered w-full mt-2">
                    <option disabled selected>
                      Subnet
                    </option>
                  </select>
                  {chain?.id !== xdcsubnet.id && (
                    <div
                      className="btn"
                      onClick={() => {
                        switchNetwork?.(xdcsubnet.id);
                      }}
                    >ƒ
                      Swith to Subnet
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
              <WriteButton {...approve} className="m-auto mt-4" />
            ) : (
              <WriteButton {...send} className="m-auto mt-4" />
            )}

            <div
              className="btn my-4 m-auto w-[120px]"
              onClick={() => {
                setData({});
              }}
            >
              Back
            </div>
          </div>
        </>
      }
      <div className="text-center my-2">Powered by XDC Zero</div>
    </>
  );
};

export default Bridge;
