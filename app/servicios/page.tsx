import Link from "next/link";
import { SERVICIOS, SITIO, INTRO_SERVICIOS } from "@/lib/sitio";
import { visibles } from "@/lib/content";

export const metadata = { title: "Servicios" };

const ACENTO: Record<string, string> = {
  menta: "var(--color-menta)",
  naranja: "var(--color-naranja)",
  azul: "var(--color-azul)",
};

export default function Servicios() {
  return (
    <section className="mx-auto max-w-[1100px] px-6 lg:px-10 py-14 md:py-20">
      <h1 className="display text-4xl md:text-6xl text-[var(--color-crema)] max-w-[14ch]">
        Servicios
      </h1>
      <p className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-[color-mix(in_srgb,#eeebe3_75%,transparent)]">
        {INTRO_SERVICIOS}
      </p>

      <div className="mt-14 space-y-px bg-[var(--color-borde)] rounded-2xl overflow-hidden">
        {SERVICIOS.map((s) => {
          const ejemplos = visibles().filter((p) => p.servicios.includes(s.id)).slice(0, 3);
          return (
            /* El id ancla cada servicio: la portada enlaza directo al
               desglose del que se picó, no al principio de la página. */
            <div
              key={s.id}
              id={s.id}
              className="scroll-mt-24 bg-[var(--color-fondo)] p-6 md:p-10"
            >
              <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
                <div>
                  <span
                    className="text-[10px] uppercase tracking-[0.22em]"
                    style={{ color: ACENTO[s.acento] }}
                  >
                    {s.familia}
                  </span>
                  <h2 className="display mt-3 text-2xl md:text-3xl text-[var(--color-crema)]">
                    {s.nombre}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[color-mix(in_srgb,#eeebe3_75%,transparent)]">
                    {s.promesa}
                  </p>
                  <p className="mt-6 text-xs leading-relaxed text-[var(--color-texto-tenue)]">
                    <span className="uppercase tracking-[0.16em]">Para quién · </span>
                    {s.paraQuien}
                  </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <h3 className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-menta)]">
                      Incluye
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {s.incluye.map((i) => (
                        <li key={i} className="flex gap-2 text-sm leading-snug text-[color-mix(in_srgb,#eeebe3_80%,transparent)]">
                          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--color-menta)]" />
                          {i}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-naranja)]">
                      No incluye
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {s.noIncluye.map((i) => (
                        <li key={i} className="flex gap-2 text-sm leading-snug text-[var(--color-texto-tenue)]">
                          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--color-naranja)]" />
                          {i}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {ejemplos.length > 0 && (
                <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[var(--color-borde)] pt-6">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-texto-tenue)]">
                    Ejemplos
                  </span>
                  {ejemplos.map((p) => (
                    <Link
                      key={p.slug}
                      href={p.rubro === "reels" ? `/reels/${p.slug}` : `/trabajo/${p.slug}`}
                      className="rounded-full border border-[var(--color-borde)] px-3 py-1.5 text-xs text-[var(--color-crema)] hover:border-[var(--color-menta)] hover:text-[var(--color-menta)] transition-colors"
                    >
                      {p.cliente} · {p.titulo}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-16 rounded-2xl border border-[var(--color-borde)] p-8 md:p-12 text-center">
        <p className="display text-2xl md:text-4xl text-[var(--color-crema)] max-w-[20ch] mx-auto">
          {SITIO.taglineCorta}
        </p>
        <Link
          href="/contacto"
          className="mt-8 inline-block rounded-full bg-[var(--color-menta)] px-7 py-3 text-sm font-medium text-[var(--color-profundo)] hover:bg-[var(--color-crema)] transition-colors"
        >
          Cuéntanos tu proyecto
        </Link>
      </div>
    </section>
  );
}
