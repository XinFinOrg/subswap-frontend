import { Dispatch, SetStateAction } from 'react';
import { CrossChainToken, tokenABI } from '../../config';
import { BridgeData, OperationObject } from '../../pages/bridge';
import { useContractReads } from 'wagmi';

type TokenSelectDialogProps = {
  setData: Dispatch<SetStateAction<BridgeData>>;
  data: BridgeData;
  address: string | undefined;
  render: number;
  tokens: CrossChainToken[];
};

export function TokenSelectDialog({
  data,
  setData,
  address,
  render,
  tokens
}: TokenSelectDialogProps) {
  const tokenBalances = useGetTokenBalances(tokens, address, render);

  return (
    <div className="modal" role="dialog">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Select a token</h3>
        {tokenBalances?.map((token, index) => {
          return (
            <div
              key={index}
              className="card cursor-pointer"
              onClick={() => {
                setData({
                  ...data,
                  token: token,
                  selectToken: !data.selectToken
                });
              }}
            >
              <div className="card-body">
                <div>
                  <div className="float-left">{token.name}</div>
                  <div className="float-right">
                    {/* (token.balance) / 10n ** token.decimals */}
                    <>{token.balance ?? 0}</>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="modal-action">
          <div className="btn btn-success" onClick={async () => { }}>
            Select
          </div>

          <label
            className="btn"
            onClick={() => {
              setData({
                ...data,
                selectToken: !data.selectToken
              });
            }}
          >
            Close
          </label>
        </div>
      </div>
    </div>
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