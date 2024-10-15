import Head from "next/head";

interface Props {
    title: string;
    description: string;
    tags: string;
    image: string;
    url: string;
}

export default function SEO({ title, description, tags, image, url }: Props) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
                />
                <link rel="icon" href="/favicon.ico" />
                <meta name="title" content={title} />
                <meta name="description" content={description} />
                <meta name="keywords" content={tags} />
                <meta name="robots" content="index, follow" />
                <meta
                    httpEquiv="Content-Type"
                    content="text/html; charset=utf-8"
                />
                <meta name="language" content="Spanish" />
                <meta name="revisit-after" content="10 days" />
                <meta name="author" content="Rodrigo Méndez" />
                <meta itemProp="name" content={title} />
                <meta itemProp="description" content={description} />

                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:site" content="@rodrigom_dev" />
                <meta name="twitter:creator" content="@rodrigom_dev" />
                <meta name="twitter:image:src" content={image} />

                <meta name="og:title" content={title} />
                <meta name="og:description" content={description} />
                <meta name="og:image" content={image} />
                <meta name="og:url" content={url} />
                <meta name="og:site_name" content="rodrigomendez.dev" />
                <meta name="og:locale" content="es_MX" />
                <meta name="og:type" content="website" />

                <meta name="application-name" content={title} />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="default"
                />
                <meta name="apple-mobile-web-app-title" content={title} />
                <meta name="description" content={description} />
                <meta name="format-detection" content="telephone=no" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta
                    name="msapplication-config"
                    content="/icons/browserconfig.xml"
                />
                <meta name="msapplication-TileColor" content="#2B5797" />
                <meta name="msapplication-tap-highlight" content="no" />
                <meta name="theme-color" content="#FFF" />

                <link
                    rel="apple-touch-icon"
                    href="/icons/touch-icon-iphone.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="152x152"
                    href="/icons/touch-icon-ipad.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/icons/touch-icon-iphone-retina.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="167x167"
                    href="/icons/touch-icon-ipad-retina.png"
                />

                <link rel="manifest" href="/manifest.json" />

                <link rel="icon" href="/favicon.ico" />
            </Head>
        </>
    );
}
