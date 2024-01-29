import React from "react";

const Contact = () => {
    return (
        <div>
            <h2 className="text-center font-bold text-3xl">Contacto</h2>
            <p className="font-bold text-primary text-center mr-2 pt-4">
                Puedes enviarme un correo electrónico ✉️
            </p>
            <div className="grid grid-cols-1">
                <div className="w-full px-10 py-6 flex flex-col items-center text-center">
                    <div className="mt-5">
                        <h2 className="font-bold text-lg">
                            Correo electrónico:
                        </h2>
                        <a
                            href="mailto:itic.rodrigomg@gmail.com"
                            className="text-secondary  text-lg"
                        >
                            itic.rodrigomg@gmail.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
