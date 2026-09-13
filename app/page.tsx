import Link from "next/link";
import Placeholder from "@/components/Placeholder";
import HeroReel from "@/components/HeroReel";
import TarjetaTrabajo from "@/components/TarjetaTrabajo";
import { SITIO, SERVICIOS } from "@/lib/sitio";
import { LOGOS_CLIENTE, visibles, type Formato } from "@/lib/content";
import { urlMedia } from "@/lib/media";

/* Los tres servicios que el estudio ofrece hoy. El audiovisual
   comercial sale de aquí junto con su rubro: no se anuncia lo que no
   se está tomando. */
const PILARES: { id: string; titulo: string; texto: string; formato: Formato; href: string }[] = [
  { id: "reels", titulo: "Contenido vertical", texto: "El motor de volumen. Una jornada de grabación, ocho a diez piezas.", formato: "vertical", href: "/reels" },
  { id: "marca", titulo: "Identidad de marca", texto: "Desde el arranque exprés hasta el sistema completo con manual.", formato: "estatico", href: "/trabajo?seccion=marca" },
  { id: "foto", titulo: "Fotografía", texto: "Producto, espacio y equipo, con la luz resuelta desde el set y no en la edición.", formato: "estatico", href: "/trabajo?seccion=foto" },
];

export default function Home() {
  const publicables = visibles();
  /* La selección enseña cuatro reels con la misma tarjeta del listado
     de Trabajo: portada quieta que se reproduce al pasar el cursor.
     Es la interacción que ya existe, no una versión aparte. */
  const destacados = publicables
    .filter((p) => p.rubro === "reels" && p.destacado)
    .slice(0, 4);
  const clientes = [...new Set(publicables.map((p) => p.cliente))];
  /* El hero rota entre seis reels, cinco segundos cada uno, mezclando
     grabado y animación: dos grabados, un animado, y otra vez. Así
     quien solo pasa por la home ve de una que el estudio hace las dos
     cosas, sin tener que entrar a ningún lado.

     Dentro de cada grupo van del más ligero al más pesado: los
     primeros son los únicos que alcanza a ver quien no se queda. */
  const porPeso = (t: "live-action" | "animacion") =>
    publicables
      .filter(
        (p) =>
          p.rubro === "reels" &&
          p.media.tipo === "local" &&
          (p.tecnica ?? "live-action") === t
      )
      .map((p) => ({ p, m: p.media as { src: string; pesoMB: number } }))
      .sort((a, b) => a.m.pesoMB - b.m.pesoMB);

  const grabados = porPeso("live-action");
  const animados = porPeso("animacion");

  const heroClips = [
    grabados[0], grabados[1], animados[0],
    grabados[2], grabados[3], animados[1],
  ]
    .filter(Boolean)
    .map(({ p, m }) => ({
      slug: p.slug,
      cliente: p.cliente,
      titulo: p.titulo,
      src: urlMedia(m.src),
    }));

  return (
    <>
      {/* ── Hero ──
          El planteamiento (documento maestro, 6.1) pide video de marca
          en el hero. Todavía no existe esa pieza, así que el hueco lo
          llena una rotación de reels reales, cinco segundos cada uno:
          ocupa el sitio que le toca y enseña seis trabajos distintos
          antes del primer scroll. */}
      <section className="relative overflow-hidden aura">
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-menta)]">
                {SITIO.nombreLargo}
              </p>
              <h1 className="display mt-6 text-[12vw] leading-[0.88] md:text-[7vw] lg:text-[5.2vw] text-[var(--color-crema)] max-w-[15ch]">
                {SITIO.tagline}
              </h1>
              <p className="mt-7 max-w-lg text-base md:text-lg leading-relaxed text-[color-mix(in_srgb,#eeebe3_72%,transparent)]">
                {SITIO.manifiesto}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/trabajo"
                  className="rounded-full bg-[var(--color-menta)] px-6 py-3 text-sm font-medium text-[var(--color-profundo)] hover:bg-[var(--color-crema)] transition-colors"
                >
                  Ver el trabajo
                </Link>
                <Link
                  href="/servicios"
                  className="rounded-full border border-[var(--color-borde)] px-6 py-3 text-sm text-[var(--color-crema)] hover:border-[var(--color-crema)] transition-colors"
                >
                  Servicios y precios
                </Link>
              </div>
            </div>

            {heroClips.length > 0 && <HeroReel clips={heroClips} />}
          </div>
        </div>
      </section>

      {/* ── Los tres pilares, cada uno en su formato nativo ── */}
      <section className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 md:py-24">
        <h2 className="display text-2xl md:text-3xl text-[var(--color-crema)]">
          Tres formas de trabajar
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3 items-start">
          {PILARES.map((p) => (
            <Link key={p.id} href={p.href} className="group">
              <div
                className="overflow-hidden rounded-xl border border-[var(--color-borde)]"
                style={{ aspectRatio: p.formato === "vertical" ? "3 / 4" : p.formato === "horizontal" ? "16 / 9" : "4 / 3" }}
              >
                <Placeholder formato={p.formato} etiqueta={p.titulo} />
              </div>
              <h3 className="display-suave mt-4 text-xl text-[var(--color-crema)] group-hover:text-[var(--color-menta)] transition-colors">
                {p.titulo}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-texto-tenue)] leading-relaxed">
                {p.texto}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Destacados ── */}
      <section className="mx-auto max-w-[1400px] px-6 lg:px-10 py-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="display text-2xl md:text-3xl text-[var(--color-crema)]">Selección</h2>
          <Link href="/trabajo" className="text-sm text-[var(--color-menta)] hover:underline">
            Ver todo →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-start">
          {destacados.map((p) => (
            <TarjetaTrabajo key={p.slug} p={p} />
          ))}
        </div>
      </section>

      {/* ── Franja de clientes ── */}
      <section className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-texto-tenue)]">
          Marcas con las que hemos trabajado
        </p>
        {/* Donde el cliente ya entregó su logotipo se pone el logo; el
            resto sigue en texto. Los dos van al mismo tono apagado y
            se encienden al pasar el cursor, para que la franja se lea
            como una sola lista y no como una mezcla. */}
        <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-6">
          {clientes.map((c) => {
            const logo = LOGOS_CLIENTE[c];
            return logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={c}
                src={logo}
                alt={c}
                className="h-7 w-auto opacity-45 transition-opacity duration-300 hover:opacity-100 md:h-8"
              />
            ) : (
              <span
                key={c}
                className="display-suave text-lg md:text-xl text-[color-mix(in_srgb,#eeebe3_45%,transparent)] transition-colors hover:text-[var(--color-crema)]"
              >
                {c}
              </span>
            );
          })}
        </div>
      </section>

      {/* ── Servicios, resumen ── */}
      <section className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <h2 className="display text-2xl md:text-3xl text-[var(--color-crema)]">Qué hacemos</h2>
        <div className="mt-8 grid gap-px bg-[var(--color-borde)] rounded-xl overflow-hidden md:grid-cols-3">
          {SERVICIOS.map((s) => (
            <div key={s.id} className="bg-[var(--color-fondo)] p-6">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-menta)]">
                Pilar {s.pilar}
              </span>
              <h3 className="display-suave mt-2 text-lg text-[var(--color-crema)]">{s.nombre}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-texto-tenue)]">{s.promesa}</p>
              <p className="mt-4 text-sm text-[var(--color-naranja)]">{s.precio}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
