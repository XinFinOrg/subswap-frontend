import { useContext } from 'react';
import ThemeContext from '../../../context/ThemeContext';
import Image from 'next/image';

export default function CoinIcon() {
  const { isDarkTheme } = useContext(ThemeContext);

  if (isDarkTheme) {
    return <Image src="/coin-light.svg" width="24" height="24" alt="Coin icon" />;
  }

  return (
    <Image src="/coin-dark.svg" width="24" height="24" alt="Coin icon" />
  );
}