"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* Inicio va primero y explícito. Antes solo se volvía al inicio
   picando el logotipo, que es una convención que da por sabida; con
   el enlace escrito no hay que saberla. */
const ENLACES = [
  { href: "/", texto: "Inicio" },
  { href: "/trabajo", texto: "Trabajo" },
  { href: "/reels", texto: "Reels" },
  { href: "/servicios", texto: "Servicios" },
  { href: "/contacto", texto: "Contacto" },
];

export default function Nav() {
  const ruta = usePathname();

  // El feed es inmersivo: la barra se quita para no competir con el video.
  if (ruta?.startsWith("/reels")) return null;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[color-mix(in_srgb,var(--color-profundo)_82%,transparent)] border-b border-[var(--color-borde)]">
      <nav className="mx-auto max-w-[1400px] px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="group flex items-center" aria-label="ECI, ir al inicio">
          {/* El logotipo cambia a menta al pasar el cursor.

              Se resuelve cruzando los dos archivos de marca en vez de
              recolorear uno: así el menta que se ve es exactamente el
              del manual y no una aproximación en CSS. Pesan poco más
              de un kilobyte cada uno. */}
          <span className="relative block h-7">
            {/* eslint-disable @next/next/no-img-element */}
            <img
              src="/marca/logos/ECI_Secundario_Crema.svg"
              alt="ECI"
              className="h-7 w-auto transition-opacity duration-300 group-hover:opacity-0"
            />
            <img
              src="/marca/logos/ECI_Secundario_Menta.svg"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-7 w-auto opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            {/* eslint-enable @next/next/no-img-element */}
          </span>
        </Link>

        <ul className="flex items-center gap-5 text-sm md:gap-8">
          {ENLACES.map((e) => {
            /* Inicio solo está activo en la raíz: con startsWith lo
               estaría en todas las páginas del sitio. */
            const activo = e.href === "/" ? ruta === "/" : ruta?.startsWith(e.href);
            return (
              <li key={e.href}>
                <Link
                  href={e.href}
                  className={`transition-colors ${
                    activo
                      ? "text-[var(--color-menta)]"
                      : "text-[var(--color-texto-tenue)] hover:text-[var(--color-crema)]"
                  }`}
                >
                  {e.texto}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
