import { Dispatch, SetStateAction } from 'react';
import { BridgeData } from '../../pages/bridge';

type SelectTokenProps = {
  data: BridgeData;
  setData: Dispatch<SetStateAction<BridgeData>>;
};

export function TokenSelect({ data, setData }: SelectTokenProps) {
  return (
    <div
      className="btn btn-success w-max mt-10"
      onClick={() => {
        setData({ ...data, selectToken: !data.selectToken });
      }}
    >
      {data.token ? data.token?.name : "Select a token"}
    </div>
  );
}