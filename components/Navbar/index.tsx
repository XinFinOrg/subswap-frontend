import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import Link from "next/link";
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';

const Navbar = () => {
  return (
    <div className="navbar items-center h-20">
      {/* Website name */}
      <div className="navbar-start">
        <div className="text-white ml-2">Subswap</div>
      </div>

      {/* Nav links */}
      <div className="navbar-center gap-4">
        <Link
          href=""
          className="btn"
          onClick={() => {
            alert("Coming Soon");
          }}
        >
          Swap
        </Link>
        <Link href="/bridge" className="btn">
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
