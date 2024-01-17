import { Dispatch, SetStateAction } from 'react';
import { GoArrowLeft } from 'react-icons/go';

type CardTitleProps = {
  title: string;
  setShowSelectNetwork: Dispatch<SetStateAction<boolean>>;
  setShowSelectToken: Dispatch<SetStateAction<boolean>>;
  showGoBackIcon?: boolean;
};

export default function CardTitle({ title, showGoBackIcon, setShowSelectNetwork, setShowSelectToken }: CardTitleProps) {
  return (
    <div className="pl-8 pt-8">
      {showGoBackIcon && (
        <button
          className="w-10 h-10 rounded-full bg-light/10 flex items-center justify-center"
          onClick={() => {
            setShowSelectNetwork(false);
            setShowSelectToken(false);
          }}
        >
          <GoArrowLeft color="bg-grey-9/50" size="20" />
        </button>
      )}
      <div className="card-title text-3xl mt-4">{title}</div>
    </div>
  );
}