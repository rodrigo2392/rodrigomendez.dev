"use client";
import React from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { setTheme } from "@/lib/features/theme";

export default function NavBar() {
  const themeState = useAppSelector((state) => state.themeState.theme);
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);

  return (
    <nav
      className={`${
        themeState === "light"
          ? "bg-white text-primary"
          : "bg-zinc-800 text-white"
      } sticky top-0 z-50 shadow-md`}
    >
      <div
        className={`max-w-6xl flex flex-wrap items-center justify-between mx-auto py-4`}
      >
        <Link href="https://rodrigomendez.dev/" className="flex items-center">
          <span className="self-center text-lg font-semibold whitespace-nowrap ">
            rodrigomendez.dev
          </span>
        </Link>
        <button
          title="Open Menu"
          aria-label="Open Menu"
          onClick={() => setOpen(!open)}
          type="button"
          className="inline-flex items-center p-2 ml-3 text-sm rounded-lg md:hidden focus:outline-none "
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className={`${open ? "" : "hidden"} w-full md:block md:w-auto`}>
          <ul className="text-center font-medium flex flex-col p-2 md:p-0 mt-2  rounded-lg md:flex-row md:space-x-5 md:mt-0">
            <li>
              <Link
                href="/#inicio"
                onClick={() => setOpen(false)}
                className="block py-2 pl-2 pr-2 rounded text-sm "
                aria-current="page"
                scroll={true}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/#acerca"
                onClick={() => setOpen(false)}
                className="block py-2 pl-1 pr-2 rounded text-sm"
                aria-current="page"
                scroll={true}
              >
                Sobre mí
              </Link>
            </li>
            <li>
              <Link
                href="/#blog"
                onClick={() => setOpen(false)}
                className="block py-2 pl-1 pr-2 rounded text-sm"
                aria-current="page"
                scroll={true}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/#videos"
                onClick={() => setOpen(false)}
                className="block py-2 pl-1 pr-2 rounded text-sm"
                aria-current="page"
                scroll={true}
              >
                Videos
              </Link>
            </li>
            <li>
              <Link
                href="/#redes"
                onClick={() => setOpen(false)}
                className="block py-2 pl-1 pr-4rounded text-sm"
                aria-current="page"
                scroll={true}
              >
                Contacto
              </Link>
            </li>
            <li>
              <button
                onClick={() =>
                  dispatch(setTheme(themeState === "light" ? "dark" : "light"))
                }
                className="block py-2 pl-1 pr-4rounded text-xl"
                aria-current="page"
              >
                {themeState === "light" ? <MdDarkMode /> : <MdLightMode />}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
