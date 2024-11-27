"use client";
import { useAppSelector } from "@/lib/store";

import { Montserrat } from "next/font/google";

const poppins = Montserrat({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export default function Main({ children }: { children: React.ReactNode }) {
  const themeState = useAppSelector((state) => state.themeState.theme);

  return (
    <main
      className={`${poppins.className} ${
        themeState === "light"
          ? "bg-white text-primary"
          : "bg-zinc-800 text-white"
      } `}
    >
      {children}
    </main>
  );
}
