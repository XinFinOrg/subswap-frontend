import { Dispatch, SetStateAction } from 'react';
import { BridgeViewData } from '../../pages/bridge';

type SelectTokenProps = {
  data: BridgeViewData;
  setData: Dispatch<SetStateAction<BridgeViewData>>;
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