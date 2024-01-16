import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

type AlertProps = {
  showAlert: boolean;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
  message: string;
  subMessage?: string;
};

export default function Alert({ showAlert, setShowAlert, message, subMessage }: AlertProps) {
  // Dismiss after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [setShowAlert]);

  if (!showAlert) {
    return null;
  }

  return (
    <>
      <div className="fixed top-5 right-5 bg-red-500 text-white p-5 rounded-md shadow-md flex justify-between items-start">
        <div className='w-64'>
          <p>{message}</p>
          <p>{subMessage}</p>
        </div>

        <button
          className="ml-4"
          onClick={() => {
            setShowAlert(false);
          }}
        >
          <IoCloseSharp size={25} />
        </button>
      </div>
    </>
  );
}
