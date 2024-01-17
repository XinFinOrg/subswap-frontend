import { Dispatch, SetStateAction, useContext } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { BridgeViewData, NetworkInfo } from "../../pages/bridge";
import Image from "next/image";
import { RiArrowDownSLine } from "react-icons/ri";

import RightArrowIcon from "@/components/Images/RightArrowIcon";
import { LiaExchangeAltSolid } from "react-icons/lia";
import CoinIcon from '../Images/CoinIcon';
import ThemeContext from '../../context/ThemeContext';

type SourceTargetSettingProps = {
  bridgeViewData: BridgeViewData;
  setBridgeViewData: Dispatch<SetStateAction<BridgeViewData>>;
  setShowSelectNetwork: Dispatch<SetStateAction<boolean>>;
};

export function SourceTargetSetting({
  bridgeViewData,
  setBridgeViewData,
  setShowSelectNetwork
}: SourceTargetSettingProps) {
  // TODO: After connect the wallet, we are able to use chain from wagmi useNetwork?
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { isDarkTheme } = useContext(ThemeContext);

  return (
    <>
      <div className="w-full">
        {/* From -> */}
        <div className="flex items-center">
          <div className="font-bold text-black/50 dark:text-light-grey text-sm">From</div>
          <div className="ml-3">
            <RightArrowIcon />
          </div>
        </div>

        {/* Select network */}
        <div
          className="px-4 py-3 text-primary border-grey-border bg-white border rounded-3xl w-full mt-2 flex justify-between dark:border-none dark:bg-light/10 cursor-pointer"
          onClick={() => {
            setBridgeViewData({
              ...bridgeViewData,
              customizeNetwork: !bridgeViewData.customizeNetwork
            });

            setShowSelectNetwork(true);
          }}
        >
          <div className="flex items-center gap-2">
            <CoinIcon />
            <div className='text-lg'>
              {bridgeViewData.fromNetwork?.name ?? "Add/Select subnet"}
            </div>
          </div>
          <div>
            <RiArrowDownSLine size="25" />
          </div>
        </div>

        {/* Use css invisible so that we can keep everything aligned */}
        <button
          className={`mt-2 px-2.5 py-1.5 text-sm text-bold text-primary bg-button-bg rounded-3xl ${bridgeViewData.fromNetwork &&
            chain?.id !== bridgeViewData.fromNetwork.id
            } ? 'invisible' : '`}
          onClick={() => {
            switchNetwork?.(bridgeViewData.fromNetwork?.id);
          }}
          disabled={!bridgeViewData.fromNetwork}
        >
          Switch
        </button>
      </div>

      <div className="bg-white border dark:border-none dark:bg-light/10 p-1 rounded-full mx-2 -mt-2">
        <LiaExchangeAltSolid size="16" color={isDarkTheme ? '#fff' : '#000'} />
      </div>

      {/* -> To */}
      <div className="w-full">
        <div className="flex items-center">
          <RightArrowIcon />
          <div className="ml-3 font-bold text-black/50 dark:text-light-grey text-sm">To</div>
        </div>
        <div
          className="px-4 py-3 text-black border-grey-border bg-white border rounded-3xl w-full mt-2 flex justify-between dark:text-white dark:border-none dark:bg-light/10"
        >
          <div className="flex items-center gap-2">
            <div className='text-lg'>
              Mainnet
            </div>
          </div>
        </div>

        {/* To help left and right sections aligned */}
        <div className="mt-3 ml-2 text-light-grey font-light text-sm h-6"></div>
      </div>
    </>
  );
}
