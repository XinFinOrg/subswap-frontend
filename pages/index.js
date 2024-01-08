import Image from "next/image";
import { Inter } from "next/font/google";
// import WriteButton from "@/components/WriteButton";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  useEffect(() => { }, []);
  return (
    <>
      <div className="text-center mt-32 text-5xl font-black">Subswap</div>
    </>
  );
}
