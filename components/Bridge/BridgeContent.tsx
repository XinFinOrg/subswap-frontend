import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { BridgeViewData, OperationObject } from "../../pages/bridge";
import Slider from "../Slider/Slider";
import SubmitButton from "../SubmitButton";
import { Section } from "./Section";
import { SourceTargetNetworkSetting } from "./SourceTargetNetworkSetting";
import Input from "../Input/Input";
import { useAccount, useNetwork } from "wagmi";

type BridgeContentProps = {
  bridgeViewData: BridgeViewData;
  setBridgeViewData: Dispatch<SetStateAction<BridgeViewData>>;
  tokenBalance: unknown;
  toAddress: string | undefined;
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
  toAddress,
}: BridgeContentProps) {
  const { chain } = useNetwork();

  const [amountMaxRange, setMaxRange] = useState(0);

  const { address } = useAccount();

  useEffect(() => {
    setMaxRange((tokenBalance || 0) as number);
  }, [tokenBalance]);

  const selectedToken = bridgeViewData?.token;

  return (
    <>
      <Section>
        <SourceTargetNetworkSetting
          bridgeViewData={bridgeViewData}
          setBridgeViewData={setBridgeViewData}
          setShowSelectNetwork={setShowSelectNetwork}
        />
      </Section>

      {bridgeViewData.fromNetwork &&
        chain?.id === bridgeViewData.fromNetwork.id && (
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
                    <div className="grow text-right text-black/50 dark:text-grey-9/50">
                      {formatBalance(bridgeViewData.amount)}
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
                  Balance: {formatBalance(tokenBalance)}
                </div>
              </div>
            </Section>
            <Section>
              <div className="flex flex-col w-full">
                <div className="collapse">
                  <input type="checkbox" />
                  <div className="collapse-title text-black/50 dark:text-light-grey text-sm">
                    Click me to show/hide more options
                  </div>
                  <div className="collapse-content">
                    <div className="flex items-center">
                      <div className="font-bold text-black/50 dark:text-light-grey text-sm">
                        Receiver
                      </div>
                    </div>
                    <div className="mt-2">
                      <Input
                        placeholder={address}
                        value={toAddress}
                        onChange={(e) => {
                          setToAddress(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Section>

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

function formatBalance(balance: unknown): string {
  if (!balance) {
    return "0";
  }

  return (balance as any).toString();
}
