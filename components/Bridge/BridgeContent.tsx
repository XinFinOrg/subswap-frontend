import { Dispatch, SetStateAction } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { BridgeViewData, OperationObject } from "../../pages/bridge";
import RightArrowIcon from "../Images/RightArrowIcon";
import Slider from "../Slider/Slider";
import SubmitButton from "../SubmitButton";
import { Section } from "./Section";
import { SourceTargetSetting } from "./SourceTargetSetting";
import Input from "../Input/Input";
import { isAddress } from "viem";

type BridgeContentProps = {
  bridgeViewData: BridgeViewData;
  setBridgeViewData: Dispatch<SetStateAction<BridgeViewData>>;
  tokenBalance: unknown;
  showApprove: boolean;
  approve: OperationObject;
  send: OperationObject;
  setShowSelectNetwork: Dispatch<SetStateAction<boolean>>;
  setShowSelectToken: Dispatch<SetStateAction<boolean>>;
  setToAddress: Dispatch<SetStateAction<string | undefined>>;
};

export function BridgeContent({
  bridgeViewData,
  setBridgeViewData,
  tokenBalance,
  showApprove,
  approve,
  send,
  setShowSelectNetwork,
  setShowSelectToken,
  setToAddress,
}: BridgeContentProps) {
  const amountMaxRange = bridgeViewData.token?.balance ?? 0;

  return (
    <>
      <Section>
        <SourceTargetSetting
          bridgeViewData={bridgeViewData}
          setBridgeViewData={setBridgeViewData}
          setShowSelectNetwork={setShowSelectNetwork}
        />
      </Section>

      {bridgeViewData.fromNetwork && (
        <>
          <Section>
            <div className="flex flex-col w-full gap-4">
              <div className="py-3 flex justify-between w-full gap-4 items-center">
                <div className="flex items-center justify-between grow">
                  {/* Token select */}
                  <div
                    className="px-4 py-3 border-grey-border border bg-white rounded-3xl flex dark:bg-light/10 dark:border-none cursor-pointer"
                    onClick={() => {
                      setShowSelectToken(true);
                    }}
                  >
                    {bridgeViewData.token?.name ?? "Select token"}
                    <RiArrowDownSLine size="25" />
                  </div>

                  {/* Selected amount */}
                  <div className="grow text-right text-grey-9">
                    {bridgeViewData.amount}
                  </div>
                </div>

                {/* Max button */}
                <button
                  onClick={() => {
                    setBridgeViewData({
                      ...bridgeViewData,
                      amount: amountMaxRange,
                    });
                  }}
                  className="rounded-full py-2 px-4 h-8 leading-none text-primary bg-button-bg dark:bg-grey-9/10"
                >
                  Max
                </button>
              </div>
              <Slider
                min={0}
                max={amountMaxRange}
                value={bridgeViewData.amount}
                onChange={(amount) => {
                  setBridgeViewData({
                    ...bridgeViewData,
                    amount,
                  });
                }}
              />
              <div className="self-end pr-1 text-black/50 dark:text-grey-9/50">
                Balance: {Number(tokenBalance ?? 0) / 1e18 || 0}
              </div>
            </div>
          </Section>
          <Section>
            <div className="flex flex-col w-full">
              <div className="flex items-center">
                <div className="font-bold text-black/50 dark:text-light-grey text-sm">
                  To address
                </div>
                <div className="ml-3">
                  <RightArrowIcon />
                </div>
              </div>
              <div className="mt-2">
                <Input
                  placeholder="Enter address"
                  onChange={(e) => {
                    // TODO: check valid address and set address to state
                    if (isAddress(e.target.value)) {
                      setToAddress(e.target.value);
                    }
                  }}
                />
              </div>
            </div>
          </Section>
          <div className="text-black/50 dark:text-grey-9/50">
            <div className="flex justify-between">
              <p>You will receive</p>
              <p className="text-right font-bold">
                {bridgeViewData.amount} token(s) A in mainnet
              </p>
            </div>
            <div className="flex justify-between mt-2">
              <p>Fee</p>
              <p className="text-right font-bold">0 USD</p>
            </div>
          </div>
          {showApprove ? (
            <SubmitButton {...approve} />
          ) : (
            <SubmitButton {...send} />
          )}
        </>
      )}
    </>
  );
}
