"use client"
import React from "react";
import { FaShare } from "react-icons/fa";

interface Props {
    title: string;
    url: string;
    text: string;
    black?: boolean;
}

export default function ShareButton({ title, url, text, black = false }: Props) {
    const share = () => {
        navigator.share({
            text,
            url,
            title,
        });
    };
    return (
        <button
            onClick={share}
            type="button"
            className={`text-sm ${
                black ? "bg-black" : "bg-blue-600"
            } text-white py-2 rounded-lg border px-5  flex gap-3 items-center w-full md:max-w-[200px] justify-center`}
        >
            Compartir <FaShare />
        </button>
    );
}

