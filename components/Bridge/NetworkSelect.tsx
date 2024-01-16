import Image from "next/image";
import { BridgeViewData, NetworkInfo } from "../../pages/bridge";
import { useState } from "react";
import { getNetwork } from '../../config';
import Spinner from '../Spinner/Spinner';
import { useGlobalContext } from '../Context';

type NetworkSelectProps = {
  storedNetworks: NetworkInfo[];
  bridgeViewData: BridgeViewData;
  setBridgeViewData: React.Dispatch<React.SetStateAction<BridgeViewData>>;
  setStoredNetworks: React.Dispatch<React.SetStateAction<NetworkInfo[]>>;
  submitRpcUrl: (
    rpcName: string | undefined,
    rpcUrl: string | undefined
  ) => Promise<void>;
};

export function NetworkSelect({
  storedNetworks,
  bridgeViewData,
  setBridgeViewData,
  setStoredNetworks,
  submitRpcUrl,
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
      if (storedNetworks.find((network) => network.name === networkName) !== undefined) {
        alert('Network already exists, please use different name');
        return;
      }

      if (hasAllDataToAddNewNetwork) {
        const newNetwork = { name: networkName, rpcUrl: networkRpcUrl };

        // set to state
        await submitRpcUrl(networkName, networkRpcUrl);
        setStoredNetworks([newNetwork, ...storedNetworks]);

        // add to localstorage
        localStorage.setItem(
          "networks",
          JSON.stringify([...storedNetworks, newNetwork])
        );
        localStorage.setItem("selectedNetwork", JSON.stringify(newNetwork));

        // reset input fields
        setNetworkName('');
        setNetworkRpcUrl('');
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
            />

            <div className="text-center text-grey-9 pt-4">or</div>
          </div>
        </div>
      )}

      {/* Add new network */}
      <div
        className={`relative border border-section-border ${hasStoredNetworks ? "rounded-b-3xl" : "rounded-3xl"
          }`}
      >
        {/* Loading state */}
        {isLoading && (
          <Spinner text="Adding" />
        )}
        <div className={`px-4 pt-8 pb-4 rounded-3xl ${isLoading ? 'bg-light/20' : ''}`}>
          <SectionTitle title="Add new network" className="pl-3" />
          {/* set network name */}
          <div className="pt-6">
            <input
              type="text"
              placeholder="Enter network name"
              className="w-full rounded-full bg-grey-9/10 p-4"
              value={networkName}
              onChange={(e) => {
                setNetworkName(e.target.value);
              }}
            />
          </div>

          {/* set rpc url */}
          <div className="pt-4">
            <input
              type="text"
              placeholder="Enter new rpc URL"
              className="w-full rounded-full bg-grey-9/10 p-4"
              value={networkRpcUrl}
              onChange={(e) => {
                setNetworkRpcUrl(e.target.value);
              }}
            />
          </div>

          {/* add network button */}
          <div className="pt-8">
            <button
              className={`w-full rounded-full p-4 font-bold text-base ${hasAllDataToAddNewNetwork
                ? "bg-primary text-white"
                : "bg-button-disabled"
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
  className?: string;
};

function NetworkSelectList({
  networks,
  className,
  bridgeViewData,
  setBridgeViewData
}: NetworkSelectListProps) {
  const [isLoading, setIsLoading] = useState(false);

  function isSelected(network: NetworkInfo) {
    return network.name === bridgeViewData.fromNetwork?.name;
  }

  return (
    <div className="relative">
      {/* Loading state */}
      {isLoading && (
        <Spinner text="Switching" />
      )}

      {/* Content */}
      <ul
        className={`${className ? className : ""
          } ${isLoading ? "bg-light/20" : ""} rounded-3xl bg-light/10 max-h-[180px] overflow-y-auto relative`}
      >
        {networks.map((network, i) => (
          <NetworkSelectItem
            key={i}
            network={network}
            selected={isSelected(network)}
            bridgeViewData={bridgeViewData}
            setBridgeViewData={setBridgeViewData}
            setIsLoading={setIsLoading}
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
};

function NetworkSelectItem({
  network,
  selected,
  bridgeViewData,
  setBridgeViewData,
  setIsLoading
}: NetworkSelectItemProps) {
  const [context, setContext] = useGlobalContext();

  async function selectStoredNetwork(network: NetworkInfo) {
    try {
      if (bridgeViewData.fromNetwork?.name === network.name) {
        return;
      }

      setIsLoading(true);
      const fromNetwork = await getNetwork(network.name, network.rpcUrl);
      setBridgeViewData({ ...bridgeViewData, fromNetwork });

      // TODO: Is this correct?
      context.rpcs.push(fromNetwork);
      setContext({
        ...context
      });

      localStorage.setItem("selectedNetwork", JSON.stringify(network));
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
        className={`${selected ? "bg-light/10" : ""} p-4 flex w-full`}
        onClick={() => selectStoredNetwork(network)}
      >
        <Image src="/coin.svg" width="24" height="24" alt="Coin icon" />
        <div className="pl-2 text-xl font-bold text-grey-9">{network.name}</div>
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
    <div
      className={`${className ? className : ""} text-xl font-bold text-grey-9`}
    >
      {title}
    </div>
  );
}
