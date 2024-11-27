"use client";

import { useAppSelector } from "@/lib/store";
import React from "react";

interface Props {
  id: string;
  children: React.ReactElement;
  gray?: boolean;
  noPaddingTop?: boolean;
}
export default function Container({
  id,
  gray = false,
  children,
  noPaddingTop = false,
}: Props) {
  const themeState = useAppSelector((state) => state.themeState.theme);
  return (
    <div
      className={`flex justify-center ${
        !noPaddingTop && "pt-10"
      }  px-10 pb-20 ${
        themeState === "light"
          ? "bg-white text-primary"
          : "bg-zinc-800 text-white"
      }`}
      id={id}
    >
      <div className="max-w-6xl">{children}</div>
    </div>
  );
}
