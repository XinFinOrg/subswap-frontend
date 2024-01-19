import Image from "next/image";
import { useContext } from 'react';
import ThemeContext from '../../../context/ThemeContext';

export default function RightArrowIcon() {
  const { isDarkTheme } = useContext(ThemeContext);
  if (isDarkTheme) {
    return <Image className='w-auto h-auto' src="/arrow-light.svg" width={30} height={30} alt="Right Arrow" />;
  }

  return <Image className='w-auto h-auto' src="/arrow-dark.svg" width={30} height={30} alt="Right Arrow" />;
}
