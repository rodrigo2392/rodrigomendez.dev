"use client";
import React from "react";
import Image from "next/image";
import { Mulish } from "next/font/google";
import ShareButton from "@/components/ShareButton";
import Button from "@/components/Button";
import { useAppSelector } from "@/lib/store";

const muslish = Mulish({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const stack = [
  {
    image: "/images/react.png",
    name: "React",
  },
  {
    image: "/images/native.png",
    name: "React Native",
  },
  {
    image: "/images/tailwind.png",
    name: "Tailwind",
  },
  {
    image: "/images/next.png",
    name: "Next JS",
  },
  {
    image: "/images/nest.png",
    name: "Nest JS",
  },
  {
    image: "/images/aws.png",
    name: "Amazon Web Services",
  },
  {
    image: "/images/ts.png",
    name: "Typescript",
  },
  {
    image: "/images/js.png",
    name: "Javascript",
  },
];

const Header = () => {
  const themeState = useAppSelector((state) => state.themeState.theme);
  return (
    <>
      <div className="flex w-full justify-center md:justify-end">
        <div className="pb-9 pt-7 flex flex-col md:flex-row gap-6  items-center">
          <ShareButton
            text="Mira el sitio web de Rodrigo"
            title="Rodrigo Méndez"
            url="https://rodrigomendez.dev"
            black
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center order-2 lg:order-1 text-center lg:text-left">
          <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl">
            Frontend Developer
          </h1>
          <p className={` ${muslish.className} pt-6 `}>
            ¡Hola! Soy Rodrigo Méndez, tengo 10 años de experiencia como
            desarrollador de software. Actualmente trabajo con el stack de React
            Native, React y Nodejs.
          </p>
          <div className="pt-4 flex flex-row gap-2 justify-center md:justify-start">
            <a
              href="https://www.linkedin.com/in/%E2%98%95-rodrigo-m%C3%A9ndez/"
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src={"/icons/linkedin.svg"}
                width={50}
                height={50}
                alt="Linkedin"
                className={`${themeState === "light" ? "" : "dark:invert"} `}
              />
            </a>
            <a
              href="https://github.com/rodrigo2392"
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src={"/icons/github.svg"}
                width={45}
                height={45}
                alt="Github"
                className={`${themeState === "light" ? "" : "dark:invert"} `}
              />
            </a>
          </div>
        </div>
        <div className="flex justify-center h-auto order-1 lg:order-2 mb-10 lg:mb-0 px-10">
          <Image
            src={"/images/perfil.png"}
            alt="Perfil"
            className="max-w-sm w-full lg:h-80 lg:w-80 rounded-full"
            width={600}
            height={600}
            loading="eager"
            priority
          />
        </div>
      </div>
      <div className="w-full flex justify-center mt-10 flex-col text-center relative">
        <h2 className="font-bold text-3xl">Tecnologías</h2>
        <p className="font-bold  text-center mb-6 pt-4">
          Con lo que actualmente trabajo 💻
        </p>
        <div className="flex gap-10 flex-wrap justify-center  mt-5">
          {stack.map((el) => (
            <div
              className="flex justify-center items-center  rounded-full shadow-md w-16 h-16"
              key={el.name}
            >
              <Image
                src={el.image}
                alt={el.name}
                title={el.name}
                width={50}
                height={50}
                className="w-10 h-10"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;
