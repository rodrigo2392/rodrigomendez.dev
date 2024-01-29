import Image from "next/image";
import React from "react";
import { Mulish } from "next/font/google";
const muslish = Mulish({
    weight: ["400", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
});

export default function About() {
    return (
        <div className="pb-10">
            <h2 className="text-center font-bold text-3xl">Sobre mí</h2>
            <a
                target="_blank"
                href="https://www.google.com/search?q=guadalajara+jalisco&oq=guadalajara+jali&aqs=edge.1.69i57j0i131i433i512j0i512l7.5066j0j1&sourceid=chrome&ie=UTF-8"
                rel="noreferrer"
            >
                <p className="font-bold text-primary text-center mb-6 pt-4">
                    Guadalajara, Jalisco, México 📌
                </p>
            </a>
            <div className="grid grid-cols-1 md:grid-cols-2 ">
                <div className="flex items-center pb-6 md:mr-10">
                    <Image
                        src="/images/developer.jpg"
                        alt="Acerca de mí"
                        height={350}
                        width={350}
                        className="w-full h-auto rounded-xl"
                    />
                </div>
                <div>
                    <p className={`${muslish.className} text-secondary`}>
                        Soy desarrollador de software con más de 10 años de
                        experiencia, he trabajo en diferentes tecnologías tanto
                        frontend como backend.
                    </p>
                    <p className={`${muslish.className} text-secondary`}>
                        Actualmente me enfoco en trabajar proyectos frontend con
                        React como tecnología principal. También en el
                        desarrollo mobile con React Native.
                    </p>
                    <p className={`${muslish.className} text-secondary`}>
                        Vivo en Guadalajara pero soy originario del estado de
                        Chiapas.
                    </p>
                </div>
            </div>
        </div>
    );
}
