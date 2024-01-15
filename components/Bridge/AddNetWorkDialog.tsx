import { Dispatch, SetStateAction } from 'react';
import { BridgeData } from '../../pages/bridge';

type AddNetWorkDialogProps = {
  setData: Dispatch<SetStateAction<BridgeData>>;
  data: BridgeData;
  submitRpcUrl: (
    rpcName: string | undefined,
    rpcUrl: string | undefined
  ) => Promise<void>;
};

export function AddNetWorkDialog({
  setData,
  data,
  submitRpcUrl
}: AddNetWorkDialogProps) {
  return (
    <div className="modal" role="dialog">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add new network</h3>
        <input
          type="text"
          placeholder="rpc name"
          className="input input-bordered w-full max-w-xs"
          onChange={(e) => {
            setData({ ...data, rpcName: e.target.value });
          }}
        />
        <input
          type="text"
          placeholder="rpc endpoint url"
          className="input input-bordered w-full max-w-xs mt-2"
          onChange={(e) => {
            setData({ ...data, rpcUrl: e.target.value });
          }}
        />
        <div className="modal-action">
          <div
            className="btn btn-success"
            onClick={async () => {
              await submitRpcUrl(data.rpcName, data.rpcUrl);
            }}
          >
            Add
          </div>
          <label
            className="btn"
            onClick={() => {
              setData({
                ...data,
                customizeNetwork: !data.customizeNetwork
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