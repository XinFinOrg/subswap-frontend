import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/bridge");
  }, []);

  return <div className="text-center mt-64 text-5xl text-white">Subswap</div>;
}
