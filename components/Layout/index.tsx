import { PropsWithChildren } from 'react';
import Navbar from "../Navbar";
import { EllipseBgs } from '../Background/EllipseBgs';

type LayoutProps = PropsWithChildren;

const Layout = ({ children }: LayoutProps) => {
  return (
    <main className='bg-black-4 min-h-screen relative overflow-hidden'>
      <EllipseBgs />
      <Navbar />
      {children}
    </main>
  );
};

export default Layout;
