import Image from "next/image";
import { Network } from "../../pages/bridge";
import { useState } from "react";

type NetworkSelectProps = {
  selectedNetwork?: Network;
  storedNetworks: Network[];
  setSelectedNetwork: React.Dispatch<React.SetStateAction<Network>>;
  setStoredNetworks: React.Dispatch<React.SetStateAction<Network[]>>;
};

export function NetworkSelect({
  selectedNetwork,
  storedNetworks,
  setSelectedNetwork,
  setStoredNetworks
}: NetworkSelectProps) {
  const [networkName, setNetworkName] = useState<string>();
  const [networkRpcUrl, setNetworkRpcUrl] = useState<string>();

  const hasStoredNetworks = storedNetworks.length > 0;
  const hasAllDataToAddNewNetwork = networkName && networkRpcUrl;

  function addNewNetwork() {
    // if exists the same name one, don't add
    if (storedNetworks.find((network) => network.name === networkName) !== undefined) {
      alert('Network already exists, please use different name');
      return;
    }

    if (hasAllDataToAddNewNetwork) {
      const newNetwork = { name: networkName, rpcUrl: networkRpcUrl };
      // add to localstorage
      localStorage.setItem(
        "networks",
        JSON.stringify([...storedNetworks, newNetwork])
      );
      localStorage.setItem("selectedNetwork", JSON.stringify(newNetwork));

      // set to state
      setStoredNetworks([...storedNetworks, newNetwork]);
      setSelectedNetwork(newNetwork);

      // reset input fields
      setNetworkName(undefined);
      setNetworkRpcUrl(undefined);
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
              selectedNetwork={selectedNetwork}
              setSelectedNetwork={setSelectedNetwork}
            />

            <div className="text-center text-grey-9 pt-4">or</div>
          </div>
        </div>
      )}

      {/* Add new network */}
      <div
        className={`border border-section-border ${hasStoredNetworks ? "rounded-b-3xl" : "rounded-3xl"
          }`}
      >
        <div className="px-4 pt-8 pb-4">
          <SectionTitle title="Add new network" className="pl-3" />
          {/* set network name */}
          <div className="pt-6">
            <input
              type="text"
              placeholder="Enter network name"
              className="w-full rounded-full bg-grey-9/10 p-4"
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
  networks: Network[];
  selectedNetwork?: Network;
  setSelectedNetwork: React.Dispatch<React.SetStateAction<Network>>;
  className?: string;
};

function NetworkSelectList({
  networks,
  className,
  selectedNetwork,
  setSelectedNetwork
}: NetworkSelectListProps) {
  function isSelected(network: Network) {
    return network.name === selectedNetwork?.name;
  }

  return (
    <ul
      className={`${className ? className : ""
        } rounded-3xl bg-light/10 max-h-[180px] overflow-y-auto`}
    >
      {networks.map((network, i) => (
        <NetworkSelectItem
          key={i}
          network={network}
          selected={isSelected(network)}
          setSelectedNetwork={setSelectedNetwork}
        />
      ))}
    </ul>
  );
}

type NetworkSelectItemProps = {
  network: Network;
  selected?: boolean;
  setSelectedNetwork: React.Dispatch<React.SetStateAction<Network>>;
};

function NetworkSelectItem({
  network,
  selected,
  setSelectedNetwork
}: NetworkSelectItemProps) {
  function selectStoredNetwork(network: Network) {
    localStorage.setItem("selectedNetwork", JSON.stringify(network));
    setSelectedNetwork(network);
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
