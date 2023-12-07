import { useState } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { xdcsubnet } from "@/config";
import WriteButton from "@/components/WriteButton";
const Bridge = () => {
  const { chain } = useNetwork();
  const [data, setData] = useState({});
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();
  console.log(data);

  const send = {
    buttonName: "Send",
  };
  return data?.token ? (
    <>
      <div className="mt-8 w-96 md:w-1/2 card m-auto shadow-2xl">
        <div className="card-body">
          <div className="flex gap-8">
            <div className="w-full">
              <div className="text-center">from</div>
              <select className="select select-bordered w-full mt-2">
                <option disabled selected>
                  {data.token}
                </option>
              </select>
              {chain.id !== xdcsubnet.id && (
                <div
                  className="btn"
                  onClick={() => {
                    switchNetwork?.(xdcsubnet.id);
                  }}
                >
                  Swith to Subnet
                </div>
              )}
            </div>
            {">"}
            <div className="w-full">
              <div className="text-center">to</div>
              <select className="select select-bordered w-full mt-2">
                <option disabled selected>
                  Select Token?
                </option>
                <option>Token A</option>
              </select>
            </div>
          </div>

          <input
            type="number"
            placeholder="0"
            className="input input-bordered w-full mt-20"
          />
        </div>

        <WriteButton {...send} className="m-auto" />

        <div className="btn my-4 m-auto w-[120px]" onClick={()=>{
            setData({})
        }}>Back</div>
      </div>
    </>
  ) : (
    <>
      <div className="mt-8 w-96 md:w-1/2 card m-auto shadow-2xl">
        <div className="card-body">
          <div className="text-left mt-32"> Select Token</div>
          <select
            className="select select-bordered w-full max-w-xs m-auto mt-4"
            onChange={(e) => {
              setData({ ...data, token: e.target.value });
            }}
          >
            <option disabled selected>
              Select Token
            </option>
            <option value={"Token A"}>Token A</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default Bridge;
