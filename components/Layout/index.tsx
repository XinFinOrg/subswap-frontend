import { PropsWithChildren } from 'react';
import Navbar from "../Navbar";
import { EllipseBgs } from '../Background/EllipseBgs';

type LayoutProps = PropsWithChildren;

const Layout = ({ children }: LayoutProps) => {
  return (
    <main className='z-0 bg-white-3 dark:bg-black-4 min-h-screen relative overflow-hidden pb-20 text-black dark:text-grey-9'>
      <EllipseBgs />
      <Navbar />
      {children}
    </main>
  );
};

export default Layout;
