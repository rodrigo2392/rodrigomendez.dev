import React from "react";
import Image from "next/image";

const stack = [
  {
    image: "/icons/youtube.svg",
    name: "Youtube",
    url: "https://www.youtube.com/@rodrigomendezdev",
  },
  {
    image: "/icons/tiktok.svg",
    name: "Tiktok",
    url: "https://www.tiktok.com/@rodrigomendezdev",
  },

  {
    image: "/icons/twitter.svg",
    name: "Twitter",
    url: "https://twitter.com/rodrigom_dev",
  },

  {
    image: "/icons/instagram.svg",
    name: "Instagram",
    url: "https://www.instagram.com/rodrigomendezdev/",
  },
  {
    image: "/icons/discord.png",
    name: "Discord",
    url: "https://discord.gg/Ac4MEkKGVm",
  },
];

const Social = () => {
  return (
    <div>
      <h2 className="text-center font-bold text-3xl">Redes sociales</h2>
      <p className="font-bold text-center mr-2 pt-4">Sígueme en mis redes 📱</p>
      <div className="flex gap-10 flex-wrap justify-center align-middle mt-5">
        {stack.map((el) => (
          <a href={el.url} key={el.name} target="_blank" rel="noreferrer">
            <div className="flex justify-center items-center rounded-full shadow-md w-16 h-16">
              <Image
                src={el.image}
                alt={el.name}
                width={400}
                height={400}
                className="w-10 h-10"
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Social;
