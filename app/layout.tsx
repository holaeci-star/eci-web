import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import { SITIO } from "@/lib/sitio";

export const metadata: Metadata = {
  title: {
    default: `${SITIO.nombre} — ${SITIO.nombreLargo}`,
    template: `%s · ${SITIO.nombre}`,
  },
  description: SITIO.promesa,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* La tipografía de titulares se pide de inmediato: es la que
            dibuja el texto grande del hero y sin ella hay salto visual. */}
        <link
          rel="preload"
          href="/fonts/BricolageGrotesque.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* R2 sirve el video: abrir la conexión antes ahorra el saludo
            TLS cuando el reproductor la necesita. */}
        <link rel="preconnect" href="https://pub-af9b91193f87401e8189e8e88ccc9f19.r2.dev" crossOrigin="anonymous" />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <footer className="border-t border-[var(--color-borde)] mt-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 grid gap-12 md:grid-cols-[1fr_auto]">
            <div>
              <p className="display text-3xl md:text-4xl max-w-xl text-[var(--color-crema)]">
                {SITIO.taglineCorta}
              </p>
              <p className="mt-5 text-sm text-[var(--color-texto-tenue)] max-w-md leading-relaxed">
                {SITIO.manifiesto}
              </p>
            </div>
            {/* Todo lo del pie es contacto, así que todo se puede
                picar. Antes el correo era un enlace y el resto texto
                muerto: quien quería escribir por Instagram tenía que
                buscarlo aparte. */}
            <div className="flex flex-col gap-2 text-sm md:items-end md:text-right">
              <a
                href={`mailto:${SITIO.correo}`}
                className="transition-colors hover:text-[var(--color-menta)]"
              >
                {SITIO.correo}
              </a>
              <a
                href={`tel:${SITIO.telefonoE164}`}
                className="text-[var(--color-texto-tenue)] transition-colors hover:text-[var(--color-menta)]"
              >
                {SITIO.telefono}
              </a>
              <a
                href={SITIO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-texto-tenue)] transition-colors hover:text-[var(--color-menta)]"
              >
                Instagram · {SITIO.instagram}
              </a>
              <a
                href={SITIO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-texto-tenue)] transition-colors hover:text-[var(--color-menta)]"
              >
                Facebook
              </a>
              <span className="text-[var(--color-texto-tenue)]">{SITIO.ciudad}</span>
            </div>
          </div>
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pb-10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[var(--color-texto-tenue)]">
            <span>© {new Date().getFullYear()} {SITIO.nombreLargo}</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
