import { useEffect, useState } from "react";
import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { OperationObject } from '../../pages/bridge';

type SubmitButtonProps = OperationObject & {
  disabled?: boolean;
};

const SubmitButton = (props: SubmitButtonProps) => {
  const [mounted, setMounted] = useState(false);
  const addRecentTransaction = useAddRecentTransaction();
  const { isConnected } = useAccount();
  const { data: tx, write } = useContractWrite({
    ...props?.data as any,
    onError(error) {
      Notify.failure(error.message);
    }
  });

  const { isSuccess: confirmed, isLoading: confirming } = useWaitForTransaction(
    {
      ...tx,
      onError(error) {
        Notify.failure(error.message);
      }
    }
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    props?.callback?.(confirmed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmed]);

  function validate() {
    if (!isConnected) {
      alert("Please connect wallet before sending transaction");
      return false;
    }

    // TODO: validate address
    if (!props.data.address) {
      alert("Please input contract address");
      return false;
    }

    return true;
  }

  return (
    mounted && (
      <div className="w-full">
        <button
          className={
            (props?.disabled || !write || confirming ? "btn-disabled " : "") +
            "btn bg-primary text-grey-9 text-base w-full rounded-3xl"
          }
          style={{ minWidth: 112 }}
          onClick={() => {
            try {
              if (!validate()) {
                alert('Validate failed');
                return;
              }

              write?.();
              if (tx) {
                addRecentTransaction({
                  hash: tx.hash,
                  description: props?.buttonName
                });

              }
            } catch (e) {
              alert('Failed to send transaction');
            }
          }}
        >
          {confirming && (
            <>
              <span className="loading loading-spinner"></span>Loading
            </>
          )}

          {props?.buttonName}
        </button>
      </div>
    )
  );
};

export default SubmitButton;
