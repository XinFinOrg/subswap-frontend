import { ConnectButton } from '@rainbow-me/rainbowkit';

export function ConnectWallet() {
  return (
    <>
      <h2 className="text-xl">Please connect to wallet before using bridge.</h2>
      <ConnectButton />
    </>
  );
}
