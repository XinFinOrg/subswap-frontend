import { Dispatch, SetStateAction, useState } from "react";
import { BridgeViewData, OperationObject } from "../../pages/bridge";
import { useContractReads } from "wagmi";
import { CrossChainToken, tokenABI } from "../../config";
import { FiSearch } from "react-icons/fi";

type SelectTokenProps = {
  bridgeViewData: BridgeViewData;
  setBridgeViewData: Dispatch<SetStateAction<BridgeViewData>>;
  tokens: CrossChainToken[];
  address: string | undefined;
  render: number;
  setShowSelectToken: Dispatch<SetStateAction<boolean>>;
};

export function TokenSelect({
  bridgeViewData,
  setBridgeViewData,
  tokens,
  address,
  render,
  setShowSelectToken
}: SelectTokenProps) {
  const [search, setSearch] = useState("");
  const tokenBalances = useGetTokenBalances(tokens, address, render);
  const filteredTokens = tokenBalances.filter((token) => token.name.includes(search));

  return (
    <>
      <div className="flex items-center rounded-3xl bg-light/10 pl-2">
        <div className="pl-2">
          <FiSearch />
        </div>
        <input
          className="bg-transparent py-4 pl-2 text-sm focus:outline-none"
          placeholder="Search by name"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {!filteredTokens.length && (
        <p className="text-grey-9 my-4 pl-4">No token found</p>
      )}

      {filteredTokens.map((token, index) => {
        const selected = bridgeViewData.token?.name === token?.name;

        return (
          <div
            key={index}
            className={`border p-4 border-section-border rounded-3xl btn flex justify-between w-full ${selected ? "hover:dark:bg-blue-600 dark:bg-blue-600" : ""
              }`}
            onClick={() => {
              setBridgeViewData({
                ...bridgeViewData,
                token,
                selectToken: !bridgeViewData.selectToken,
                amount: 0
              });

              setShowSelectToken(false);
            }}
          >
            <p className="text-grey-9 text-left">{token.name}</p>
            <p className="text-grey-9/60 text-right">
              {token.balance?.toString()}
            </p>
          </div>
        );
      })}
    </>
  );
}

const useGetReads1 = (
  tokens: CrossChainToken[],
  address: string | undefined,
  render: number
) => {
  const tokenBalanceReads = tokens?.map<OperationObject.Data>((token) => {
    return {
      abi: tokenABI,
      address: token.originalToken,
      functionName: "balanceOf",
      args: [address]
    };
  });

  const { data } = useContractReads({
    contracts: tokenBalanceReads as any,
    scopeKey: render.toString()
  });

  return data;
};

const useGetTokenBalances = (
  tokens: CrossChainToken[],
  address: string | undefined,
  render: number
) => {
  const reads1 = useGetReads1(tokens, address, render);
  const tokenDecimalsReads = tokens?.map<OperationObject.Data>((token) => {
    return {
      abi: tokenABI,
      address: token.originalToken,
      functionName: "decimals"
    };
  });

  const { data: reads2 } = useContractReads({
    contracts: tokenDecimalsReads as any,
    scopeKey: render.toString()
  });

  return tokens?.map((token, index) => {
    return {
      ...token,
      balance: reads1?.[index]?.result,
      decimals: reads2?.[index]?.result
    };
  });
};
