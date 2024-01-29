import React from "react";
import Image from "next/image";

const Footer = () => {
    return (
        <footer className="h-28 flex items-center bg-primary px-10 md:px-24 justify-between">
            <div>
                <p className="text-white font-bold text-sm">
                    Copyright © 2024. <a href="https://rodrigomendez.dev">rodrigomendez.dev</a>
                </p>
            </div>
            <div className="flex-row gap-2 justify-center md:justify-start hidden md:flex">
                <a
                    href="https://www.linkedin.com/in/%E2%98%95-rodrigo-m%C3%A9ndez/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <Image
                        src="/icons/linkedin-w.svg"
                        width={40}
                        height={40}
                        alt="Linkedin"
                    />
                </a>
                <a
                    href="https://github.com/rodrigo2392"
                    target="_blank"
                    rel="noreferrer"
                >
                    <Image
                        src="/icons/github-w.svg"
                        width={35}
                        height={35}
                        alt="Github"
                    />
                </a>
            </div>
        </footer>
    );
};

export default Footer;
