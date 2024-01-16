import { Dispatch, SetStateAction } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { Section } from "./Section";
import { BridgeViewData, NetworkInfo } from "../../pages/bridge";
import Image from "next/image";
import { RiArrowDownSLine } from "react-icons/ri";

import RightArrow from "@/components/RightArrow";
import { LiaExchangeAltSolid } from "react-icons/lia";

type SourceTargetSettingProps = {
  bridgeViewData: BridgeViewData;
  setBridgeViewData: Dispatch<SetStateAction<BridgeViewData>>;
  tokenBalance: any;
  setShowSelectNetwork: Dispatch<SetStateAction<boolean>>;
};

export function SourceTargetSetting({
  bridgeViewData,
  setBridgeViewData,
  // tokenBalance,
  setShowSelectNetwork
}: SourceTargetSettingProps) {
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

        {/* Select network */}
        <div
          className="btn rounded-3xl w-full mt-2 bg-light/10 text-primary flex justify-between"
          onClick={() => {
            setBridgeViewData({
              ...bridgeViewData,
              customizeNetwork: !bridgeViewData.customizeNetwork
            });

            setShowSelectNetwork(true);
          }}
        >
          <div className="flex items-center gap-2">
            <Image src="/coin.svg" width="24" height="24" alt="Coin icon" />
            {bridgeViewData.fromNetwork?.name ?? "Add/Select subnet"}
          </div>
          <div>
            <RiArrowDownSLine size="20" />
          </div>
        </div>

        {bridgeViewData.fromNetwork && chain?.id !== bridgeViewData.fromNetwork.id && (
          <button
            className="mt-2 px-2.5 py-1.5 text-sm text-bold text-primary bg-button-bg rounded-3xl"
            onClick={() => {
              switchNetwork?.(bridgeViewData.fromNetwork?.id);
            }}
            disabled={!bridgeViewData.fromNetwork}
          >
            Switch
          </button>
        )}
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
          {/* Balance: {Number(tokenBalance ?? 0) / 1e18 || 0}
          {data.token?.name}{" "} */}
        </div>
      </div>
    </Section>
  );
}
