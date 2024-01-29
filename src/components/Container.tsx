import React from "react";

interface Props {
    id: string;
    children: React.ReactElement;
    gray?: boolean;
    noPaddingTop?: boolean;
}
export default function Container({ id, gray = false, children, noPaddingTop = false }: Props) {
    return (
        <div
            className={`flex justify-center ${
                !noPaddingTop && "pt-24"
            } text-primary px-10 pb-20 ${gray ? "bg-bgGray" : "bg-white"}`}
            id={id}
        >
            <div className="max-w-4xl">{children}</div>
        </div>
    );
}
