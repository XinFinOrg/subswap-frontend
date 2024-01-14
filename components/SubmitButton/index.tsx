import { useEffect, useState } from "react";
import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

const SubmitButton = (props: any) => {
  const [mounted, setMounted] = useState(false);
  const addRecentTransaction = useAddRecentTransaction();
  const { isConnected } = useAccount();
  const { data: tx, write } = useContractWrite({
    ...props?.data,
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

  return (
    mounted && (
      <div className={`${props.className} w-full`}>
        {
          <button
            className={
              (props?.disabled || !write || confirming ? "btn-disabled " : "") +
              "btn btn-primary btn-outline text-xs w-full rounded-3xl"
            }
            // disabled={props?.disabled || !write || confirming}
            style={{ minWidth: 112 }}
            onClick={() => {
              if (!isConnected) {
                alert("Please connect wallet before sending transaction");
                return;
              }

              write?.();
              if (tx) {
                try {
                  addRecentTransaction({
                    hash: tx.hash,
                    description: props?.buttonName
                  });
                } catch (e) { }
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
        }
      </div>
    )
  );
};

export default SubmitButton;
