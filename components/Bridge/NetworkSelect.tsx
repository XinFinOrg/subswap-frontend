import Image from "next/image";
import { BridgeViewData, NetworkInfo } from "../../pages/bridge";
import { useState } from "react";
import { getNetwork } from "../../config";
import Spinner from "../Spinner/Spinner";
import { useGlobalContext } from "../../context";
import CoinIcon from "../Images/CoinIcon";
import Input from "../Input/Input";

type NetworkSelectProps = {
  storedNetworks: NetworkInfo[];
  bridgeViewData: BridgeViewData;
  setBridgeViewData: React.Dispatch<React.SetStateAction<BridgeViewData>>;
  setStoredNetworks: React.Dispatch<React.SetStateAction<NetworkInfo[]>>;
  submitRpcNameAndUrl: (
    rpcName: string | undefined,
    rpcUrl: string | undefined,
    selectLeftSide: boolean | undefined
  ) => Promise<void>;
  setShowSelectNetwork: React.Dispatch<React.SetStateAction<boolean>>;
};

export function NetworkSelect({
  storedNetworks,
  bridgeViewData,
  setBridgeViewData,
  setStoredNetworks,
  submitRpcNameAndUrl,
  setShowSelectNetwork,
}: NetworkSelectProps) {
  const [networkName, setNetworkName] = useState<string>();
  const [networkRpcUrl, setNetworkRpcUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const hasStoredNetworks = storedNetworks.length > 0;
  const hasAllDataToAddNewNetwork = networkName && networkRpcUrl;

  async function addNewNetwork() {
    try {
      setIsLoading(true);

      // if exists the same name one, don't add
      if (
        storedNetworks.find((network) => network.name === networkName) !==
        undefined
      ) {
        alert("Network already exists, please use different name");
        return;
      }

      if (hasAllDataToAddNewNetwork) {
        const newNetwork = { name: networkName, rpcUrl: networkRpcUrl };

        // set to state
        await submitRpcNameAndUrl(
          networkName,
          networkRpcUrl,
          bridgeViewData.selectLeftSide
        );
        setStoredNetworks([newNetwork, ...storedNetworks]);

        // add to localstorage
        localStorage.setItem(
          "networks",
          JSON.stringify([...storedNetworks, newNetwork])
        );
        localStorage.setItem("selectedNetwork", JSON.stringify(newNetwork));

        // reset input fields
        setNetworkName("");
        setNetworkRpcUrl("");

        setShowSelectNetwork(false);
      }
    } catch (error) {
      alert(error);
      return;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="gap-0">
      {/* Show the stored networks if there are any */}
      {hasStoredNetworks && (
        <div className="border rounded-t-3xl border-section-border">
          <div className="px-4 pt-8 pb-4">
            <SectionTitle title="Select Network" className="pl-3" />
            <NetworkSelectList
              networks={storedNetworks}
              className="mt-6"
              bridgeViewData={bridgeViewData}
              setBridgeViewData={setBridgeViewData}
              setShowSelectNetwork={setShowSelectNetwork}
            />

            <div className="text-center pt-4">or</div>
          </div>
        </div>
      )}

      {/* Add new network */}
      <div
        className={`relative border border-section-border ${
          hasStoredNetworks ? "rounded-b-3xl" : "rounded-3xl"
        }`}
      >
        {/* Loading state */}
        {isLoading && <Spinner text="Adding" />}
        <div
          className={`px-4 pt-8 pb-4 rounded-3xl ${
            isLoading ? "opacity-20" : ""
          }`}
        >
          <SectionTitle title="Add new network" className="pl-3" />
          {/* set network name */}
          <div className="pt-6">
            <Input
              placeholder="Enter network name"
              onChange={(v) => {
                setNetworkName(v.target.value);
              }}
            />
          </div>

          {/* set rpc url */}
          <div className="pt-4">
            <Input
              placeholder="Enter new rpc URL"
              onChange={(v) => {
                setNetworkRpcUrl(v.target.value);
              }}
            />
          </div>

          {/* add network button */}
          <div className="pt-8">
            <button
              className={`w-full rounded-full p-4 font-bold text-base ${
                hasAllDataToAddNewNetwork
                  ? "bg-primary text-white"
                  : "bg-button-disabled dark:bg-button-disabled-dark"
              }`}
              disabled={!hasAllDataToAddNewNetwork}
              onClick={addNewNetwork}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type NetworkSelectListProps = {
  networks: NetworkInfo[];
  bridgeViewData: BridgeViewData;
  setBridgeViewData: React.Dispatch<React.SetStateAction<BridgeViewData>>;
  setShowSelectNetwork: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
};

function NetworkSelectList({
  networks,
  className,
  bridgeViewData,
  setBridgeViewData,
  setShowSelectNetwork,
}: NetworkSelectListProps) {
  const [isLoading, setIsLoading] = useState(false);

  function isSelected(network: NetworkInfo) {
    const selectLeftSide = bridgeViewData.selectLeftSide;
    const selectName = selectLeftSide
      ? bridgeViewData.fromNetwork?.name
      : bridgeViewData.toNetwork?.name;
    return network.name === selectName;
  }

  return (
    <div className="relative">
      {/* Loading state */}
      {isLoading && <Spinner text="Switching" />}

      {/* Content */}
      <ul
        className={`${className ? className : ""} ${
          isLoading ? "opacity-20" : ""
        } rounded-3xl bg-light/10 max-h-[180px] overflow-y-auto relative`}
      >
        {networks.map((network, i) => (
          <NetworkSelectItem
            key={i}
            network={network}
            selected={isSelected(network)}
            bridgeViewData={bridgeViewData}
            setBridgeViewData={setBridgeViewData}
            setIsLoading={setIsLoading}
            setShowSelectNetwork={setShowSelectNetwork}
          />
        ))}
      </ul>
    </div>
  );
}

type NetworkSelectItemProps = {
  network: NetworkInfo;
  selected?: boolean;
  bridgeViewData: BridgeViewData;
  setBridgeViewData: React.Dispatch<React.SetStateAction<BridgeViewData>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSelectNetwork: React.Dispatch<React.SetStateAction<boolean>>;
};

function NetworkSelectItem({
  network,
  selected,
  bridgeViewData,
  setBridgeViewData,
  setIsLoading,
  setShowSelectNetwork,
}: NetworkSelectItemProps) {
  const [context, setContext] = useGlobalContext();

  async function selectStoredNetwork(network: NetworkInfo) {
    try {
      const selectLeftSide = bridgeViewData.selectLeftSide;
      const selectName = selectLeftSide
        ? bridgeViewData.fromNetwork?.name
        : bridgeViewData.toNetwork?.name;
      if (selectName === network.name) {
        setShowSelectNetwork(false);
        return;
      }

      setIsLoading(true);
      const selectNetwork = await getNetwork(network.name, network.rpcUrl);
      if (selectLeftSide) {
        setBridgeViewData({ ...bridgeViewData, fromNetwork: selectNetwork });
      } else {
        setBridgeViewData({ ...bridgeViewData, toNetwork: selectNetwork });
      }

      context.rpcs.push(selectNetwork);
      setContext({
        ...context,
      });

      localStorage.setItem("selectedNetwork", JSON.stringify(network));
      setShowSelectNetwork(false);
    } catch (error) {
      alert(error);
      return;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <li>
      <button
        className={`${
          selected
            ? "dark:bg-blue-600 bg-blue-300"
            : "dark:bg-light/10 bg-light-blue-1"
        } p-4 flex w-full`}
        onClick={() => selectStoredNetwork(network)}
      >
        <CoinIcon />
        <div className="pl-2 text-xl font-bold">{network.name}</div>
      </button>
    </li>
  );
}

type SectionTitleProps = {
  title: string;
  className?: string;
};

function SectionTitle({ title, className }: SectionTitleProps) {
  return (
    <div className={`${className ? className : ""} text-xl font-bold`}>
      {title}
    </div>
  );
}
