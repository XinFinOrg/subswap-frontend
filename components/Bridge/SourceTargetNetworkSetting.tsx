import { Dispatch, SetStateAction, useContext, useState } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { BridgeViewData } from "../../pages/bridge";
import { RiArrowDownSLine } from "react-icons/ri";

import RightArrowIcon from "@/components/Images/RightArrowIcon";
import { LiaExchangeAltSolid } from "react-icons/lia";
import CoinIcon from "../Images/CoinIcon";
import ThemeContext from "../../context/ThemeContext";

type SourceTargetNetworkSettingProps = {
  bridgeViewData: BridgeViewData;
  setBridgeViewData: Dispatch<SetStateAction<BridgeViewData>>;
  setShowSelectNetwork: Dispatch<SetStateAction<boolean>>;
};

export function SourceTargetNetworkSetting({
  bridgeViewData,
  setBridgeViewData,
  setShowSelectNetwork,
}: SourceTargetNetworkSettingProps) {
  // TODO: After connect the wallet, we are able to use chain from wagmi useNetwork?
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const { isDarkTheme } = useContext(ThemeContext);
  const hideSwitchButton =
    !bridgeViewData.fromNetwork || chain?.id === bridgeViewData.fromNetwork.id;
  const selectLeftSide = bridgeViewData.selectLeftSide;
  return (
    <>
      <div className="w-full">
        {/* From -> */}
        <div className="flex items-center">
          <div className="font-bold text-black/50 dark:text-light-grey text-sm">
            From
          </div>

          <div className="ml-3">
            <RightArrowIcon />
          </div>
        </div>

        {/* Select network */}
        <div
          className={
            "px-4 py-3 border-grey-border bg-white border rounded-3xl w-full mt-2 flex justify-between  cursor-pointer " +
            (selectLeftSide
              ? "dark:border-none dark:bg-light/10"
              : "dark:text-white dark:border-none dark:bg-light/10")
          }
          onClick={() => {
            setBridgeViewData({
              ...bridgeViewData,
              customizeNetwork: !bridgeViewData.customizeNetwork,
            });
            if (selectLeftSide) {
              setShowSelectNetwork(true);
            }
          }}
        >
          <div className="flex items-center gap-2">
            <CoinIcon />
            <div className="text-lg">
              {bridgeViewData.fromNetwork?.name ?? "Select subnet"}
            </div>
          </div>
          <div>{selectLeftSide && <RiArrowDownSLine size="25" />}</div>
        </div>

        {/* Use css invisible so that we can keep everything aligned */}
        <button
          className={`mt-2 px-2.5 py-1.5 text-sm text-bold text-primary bg-button-bg rounded-3xl ${
            hideSwitchButton ? "invisible" : ""
          } `}
          onClick={() => {
            switchNetwork?.(bridgeViewData.fromNetwork?.id);
          }}
          disabled={!bridgeViewData.fromNetwork}
        >
          Switch
        </button>
      </div>

      <div
        className="bg-white border dark:border-none dark:bg-light/10 p-1 rounded-full mx-2 -mt-2"
        onClick={() => {
          const tempNetwork = bridgeViewData.fromNetwork;
          bridgeViewData.fromNetwork = bridgeViewData.toNetwork;
          bridgeViewData.toNetwork = tempNetwork;
          bridgeViewData.selectLeftSide = !selectLeftSide;

          setBridgeViewData({
            ...bridgeViewData,
          });
        }}
      >
        <LiaExchangeAltSolid size="16" color={isDarkTheme ? "#fff" : "#000"} />
      </div>

      {/* -> To */}
      <div className="w-full">
        <div className="flex items-center">
          <RightArrowIcon />
          <div className="ml-3 font-bold text-black/50 dark:text-light-grey text-sm">
            To
          </div>
        </div>
        <div
          className={
            "px-4 py-3 border-grey-border bg-white border rounded-3xl w-full mt-2 flex justify-between  cursor-pointer " +
            (!selectLeftSide
              ? "dark:border-none dark:bg-light/10"
              : "dark:text-white dark:border-none dark:bg-light/10")
          }
          onClick={() => {
            if (!selectLeftSide) {
              setShowSelectNetwork(true);
            }
          }}
        >
          <div className="flex items-center gap-2">
            <div className="text-lg">
              {" "}
              {bridgeViewData.toNetwork?.name ?? "Select Network"}
            </div>
          </div>
          <div>{!selectLeftSide && <RiArrowDownSLine size="25" />}</div>
        </div>

        {/* To help left and right sections aligned */}
        <div className="mt-3 ml-2 text-light-grey font-light text-sm h-6"></div>
      </div>
    </>
  );
}
