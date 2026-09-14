import Link from "next/link";
import HeroReel from "@/components/HeroReel";
import PilarRotativo from "@/components/PilarRotativo";
import TarjetaTrabajo from "@/components/TarjetaTrabajo";
import { SITIO, FAMILIAS } from "@/lib/sitio";
import { LOGOS_CLIENTE, altoLogo, visibles } from "@/lib/content";
import { urlMedia } from "@/lib/media";

/* Cuántas portadas alcanza a girar un pilar. Ocho son más de medio
   minuto de rotación: nadie se queda tanto en la portada, y montar
   más solo serviría para pedir imágenes que nadie va a ver. */
const MAX_PORTADAS = 8;

export default function Home() {
  const publicables = visibles();

  /* ── Las portadas que gira cada pilar ──

     Salen del material real, no de una lista escrita a mano: cuando
     entre un cliente nuevo, su portada entra sola.

     Marca abre con Shiny por pedido del estudio; es la identidad que
     mejor se lee en miniatura. */
  const deMarca = publicables.filter(
    (p) => (p.rubro === "marca" || p.rubro === "marca-express") && p.tarjetaHover
  );
  const portadasMarca = [
    ...deMarca.filter((p) => p.cliente === "Shiny"),
    ...deMarca.filter((p) => p.cliente !== "Shiny"),
  ]
    .map((p) => p.tarjetaHover!)
    .slice(0, MAX_PORTADAS);

  const portadasReels = publicables
    .filter((p) => p.rubro === "reels" && p.tarjeta)
    .map((p) => p.tarjeta!)
    .slice(0, MAX_PORTADAS);

  /* Fotografía gira las tarjetas de cada sesión. Mientras haya una
     sola sesión publicada eso sería una imagen fija, así que se
     completa con las otras dos portadas de esa misma sesión: sigue
     siendo material del proyecto, no relleno. */
  const sesiones = publicables.filter((p) => p.rubro === "foto");
  const portadasFoto = (
    sesiones.length > 1
      ? sesiones.map((p) => p.tarjeta)
      : [sesiones[0]?.tarjeta, sesiones[0]?.tarjetaHover, sesiones[0]?.portada]
  ).filter((x): x is string => Boolean(x));

  /* Las tres áreas con trabajo publicado. El audiovisual comercial
     no está aquí —se ofrece, pero no se enseña todavía— y por eso
     esta sección y la de "Qué hacemos" no listan lo mismo. */
  const PILARES = [
    {
      id: "reels",
      titulo: "Contenido vertical",
      texto: "El motor de volumen. Una jornada de grabación, seis a ocho piezas.",
      href: "/reels",
      proporcion: "3 / 4",
      imagenes: portadasReels,
    },
    {
      id: "marca",
      titulo: "Identidad de marca",
      texto: "Desde el arranque exprés hasta el sistema completo con manual.",
      href: "/trabajo?seccion=marca",
      proporcion: "4 / 3",
      imagenes: portadasMarca,
    },
    {
      id: "foto",
      titulo: "Fotografía",
      texto:
        "Producto, espacio y equipo, con la luz resuelta desde el set y no en la edición.",
      href: "/trabajo?seccion=foto",
      proporcion: "4 / 3",
      imagenes: portadasFoto,
    },
  ];

  /* La selección enseña cuatro reels con la misma tarjeta del listado
     de Trabajo: portada quieta que se reproduce al pasar el cursor.
     Es la interacción que ya existe, no una versión aparte. */
  const destacados = publicables
    .filter((p) => p.rubro === "reels" && p.destacado)
    .slice(0, 4);

  /* La franja lista clientes con logotipo exportado. Quien no lo
     tiene no aparece: ver media fila en la tipografía del sitio hacía
     ver la otra media como un pendiente. */
  const clientes = [...new Set(publicables.map((p) => p.cliente))].filter(
    (c) => LOGOS_CLIENTE[c]
  );

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
              {/* El logotipo oficial, en lugar de la leyenda escrita.
                  Es el mismo texto —"Espacio de Creación e Innovación"
                  va dentro del archivo— pero dicho con la marca y no
                  con la tipografía del sitio. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/marca/logos/ECI_Principal_Crema.svg"
                alt={`${SITIO.nombre} — ${SITIO.nombreLargo}`}
                className="h-16 w-auto md:h-20"
              />
              <h1 className="display mt-7 text-[12vw] leading-[0.88] md:text-[7vw] lg:text-[5.2vw] text-[var(--color-crema)] max-w-[15ch]">
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
                  Qué hacemos
                </Link>
              </div>
            </div>

            {heroClips.length > 0 && <HeroReel clips={heroClips} />}
          </div>
        </div>
      </section>

      {/* ── Las tres formas de trabajar, con trabajo de verdad dentro ── */}
      <section className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 md:py-24">
        <h2 className="display text-2xl md:text-3xl text-[var(--color-crema)]">
          Tres formas de trabajar
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3 items-start">
          {PILARES.map((p) => (
            <Link key={p.id} href={p.href} className="group">
              <PilarRotativo
                imagenes={p.imagenes}
                proporcion={p.proporcion}
                alt={p.titulo}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
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
        {/* Cada logotipo se dibuja a la altura que le toca por su
            proporción, no todos a la misma: ver `altoLogo`. */}
        <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-6">
          {clientes.map((c) => {
            const logo = LOGOS_CLIENTE[c];
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={c}
                src={logo.src}
                alt={c}
                style={{ height: altoLogo(logo.ratio) }}
                className="w-auto opacity-45 transition-opacity duration-300 hover:opacity-100"
              />
            );
          })}
        </div>
      </section>

      {/* ── Qué hacemos ──
          Los cuatro servicios que se ofrecen hoy, por familia. La
          identidad va en una sola tarjeta con sus dos niveles: son el
          mismo trabajo con distinto alcance, y separarlos hacía que
          parecieran cosas distintas. */}
      <section className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <h2 className="display text-2xl md:text-3xl text-[var(--color-crema)]">Qué hacemos</h2>
        <div className="mt-8 grid gap-px bg-[var(--color-borde)] rounded-xl overflow-hidden md:grid-cols-2 lg:grid-cols-4">
          {FAMILIAS.map((f) => (
            <div key={f.familia} className="bg-[var(--color-fondo)] p-6">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-menta)]">
                {f.familia}
              </span>
              {f.servicios.map((s, i) => (
                <div key={s.id} className={i > 0 ? "mt-7" : ""}>
                  <h3
                    className={
                      i === 0
                        ? "display-suave mt-2 text-lg text-[var(--color-crema)]"
                        : "display-suave text-base text-[color-mix(in_srgb,#eeebe3_78%,transparent)]"
                    }
                  >
                    {s.nombre}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-texto-tenue)]">
                    {s.promesa}
                  </p>
                  {/* Donde antes iba el precio. Lleva al desglose del
                      servicio, que es lo que de verdad se quiere leer
                      antes de preguntar cuánto cuesta. */}
                  <Link
                    href={`/servicios#${s.id}`}
                    className="mt-4 inline-block text-sm text-[var(--color-naranja)] hover:underline"
                  >
                    De qué va este servicio →
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
