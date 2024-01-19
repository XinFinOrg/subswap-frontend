import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import Link from "next/link";
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';

const Navbar = () => {
  return (
    <div className="z-10 navbar items-center h-20">
      <div className="navbar-start flex gap-4">
        {/* Website name */}
        <div className="text-xl ml-2">Subswap</div>

        {/* Nav links */}
        <Link
          href=""
          className="btn text-white dark:text-black bg-primary dark:bg-white border-0 hover:bg-primary/60"
          onClick={() => {
            alert("Coming Soon");
          }}
        >
          Swap
        </Link>
        <Link
          href="/bridge"
          className="btn text-white dark:text-black bg-primary dark:bg-white border-0 hover:bg-primary/60"
        >
          Bridge
        </Link>
      </div>

      {/* Connect button & theme toggle */}
      <div className="navbar-end">
        <ConnectButton />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Navbar;
