import { Dispatch, SetStateAction } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { Section } from "./Section";
import { BridgeData } from "../../pages/bridge";

import RightArrow from "@/components/RightArrow";
import { LiaExchangeAltSolid } from "react-icons/lia";

type SourceTargetSelectProps = {
  data: BridgeData;
  setData: Dispatch<SetStateAction<BridgeData>>;
  tokenBalance: any;
  setShowSelectNetwork: Dispatch<SetStateAction<boolean>>;
};

export function SourceTargetSelect({
  data,
  setData,
  tokenBalance,
  setShowSelectNetwork
}: SourceTargetSelectProps) {
  // TODO: After connect the wallet, we are able to use chain from wagmi useNetwork?
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  return (
    <Section>
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

              setShowSelectNetwork(true);
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
    </Section>
  );
}
