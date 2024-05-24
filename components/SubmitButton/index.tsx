import { useEffect, useState } from "react";
import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { isAddress } from 'viem';

import { OperationObject } from '../../pages/bridge';
import Alert from '../Alert/Alert';

type SubmitButtonProps = OperationObject & {
  disabled?: boolean;
};

const SubmitButton = (props: SubmitButtonProps) => {
  const [mounted, setMounted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const addRecentTransaction = useAddRecentTransaction();
  const { isConnected } = useAccount();
  const { data: tx, write } = useContractWrite({
    ...props?.data as any,
    onError(error) {
      Notify.failure(error.message);
    }
  });

  console.log(tx)

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

  function validate(): [boolean, string?] {
    if (!isConnected) {
      return [false, "Please connect wallet before sending transaction"];
    }

    if (!props.data.address) {
      return [false, "Please input address"];
    }

    if (isAddress(props.data.address) === false) {
      return [false, "Invalid address"];
    }

    return [true];
  }

  return (
    mounted && (
      <>
        <div className="w-full relative">
          <button
            className={
              (props?.disabled || !write || confirming ? "btn-disabled " : "") +
              "btn bg-primary text-grey-9 text-base w-full rounded-3xl border-0"
            }
            style={{ minWidth: 112 }}
            onClick={() => {
              try {
                const [valid, message = ""] = validate();

                if (!valid) {
                  setShowAlert(true);
                  setAlertMessage(message);

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
            {confirming ? (
              <>
                <span className="loading loading-spinner"></span>
              </>
            ) : <span>{props?.buttonName}</span>
            }


          </button>
        </div>
        {showAlert && <Alert showAlert={showAlert} setShowAlert={setShowAlert} message={alertMessage} subMessage="Version: viem@1.5.3" />}
      </>
    )
  );
};

export default SubmitButton;
