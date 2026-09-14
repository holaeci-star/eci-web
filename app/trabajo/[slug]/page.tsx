import Link from "next/link";
import Grafico from "@/components/Grafico";
import { notFound } from "next/navigation";
import Placeholder from "@/components/Placeholder";
import ModulosCaso from "@/components/ModulosCaso";
import Colaboradores from "@/components/Colaboradores";
import ReproductorYouTube from "@/components/ReproductorYouTube";
import {
  RUBROS,
  esVisible,
  iniciales,
  listar,
  piezaPorSlug,
  otrasDelCliente,
  visibles,
  type Pieza,
} from "@/lib/content";
import { SITIO, SERVICIOS } from "@/lib/sitio";
import { urlMedia } from "@/lib/media";

export function generateStaticParams() {
  // Los rubros ocultos no generan ruta: no se listan ni se indexan.
  return visibles()
    .filter((p) => p.rubro !== "reels")
    .map((p) => ({ slug: p.slug }));
}

function Resumen({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-2xl text-lg leading-relaxed text-[color-mix(in_srgb,#eeebe3_78%,transparent)]">
      {children}
    </p>
  );
}

function CajaLogo({ pieza, tam = 44 }: { pieza: Pieza; tam?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-lg border border-[var(--color-borde)] bg-[var(--color-superficie)] overflow-hidden"
      style={{ width: tam, height: tam }}
    >
      {pieza.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={pieza.logo}
          alt=""
          className={
            pieza.logoLleno
              ? "h-full w-full object-cover"
              : "h-[62%] w-[62%] object-contain"
          }
        />
      ) : (
        <span
          className="display text-[var(--color-crema)] leading-none"
          style={{ fontSize: tam * 0.38 }}
        >
          {iniciales(pieza.cliente)}
        </span>
      )}
    </span>
  );
}

export default async function Caso({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = piezaPorSlug(slug);
  if (!p || !esVisible(p)) notFound();

  const rubro = RUBROS.find((r) => r.id === p.rubro);
  const hermanas = otrasDelCliente(p);
  const servicios = SERVICIOS.filter((s) => p.servicios.includes(s.id));

  return (
    <article className="mx-auto max-w-[1100px] px-6 lg:px-10 py-14 md:py-20">
      <Link
        href="/trabajo"
        className="text-sm text-[var(--color-texto-tenue)] hover:text-[var(--color-menta)] transition-colors"
      >
        ← Trabajo
      </Link>

      {/* ── Identidad del cliente ── */}
      <header className="mt-8">
        <div className="flex items-center gap-3">
          <CajaLogo pieza={p} />
          <div>
            <p className="display-suave text-lg leading-tight text-[var(--color-menta)]">
              {p.cliente}
            </p>
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-texto-tenue)]">
              {p.categoria} · {rubro?.nombre} · {p.anio}
            </p>
            {p.agencias && p.agencias.length > 0 && (
              <p className="mt-0.5 text-[11px] text-[color-mix(in_srgb,#eeebe3_62%,transparent)]">
                Con {listar(p.agencias)}
              </p>
            )}
          </div>
        </div>

        <h1 className="display mt-7 text-4xl md:text-6xl text-[var(--color-crema)] max-w-[18ch]">
          {p.titulo}
        </h1>

        {/* Descripción muy breve. Por omisión va aquí, pegada al
            título; las identidades exprés la piden después de la
            portada, porque ahí la portada es el logotipo terminado y
            se lee mejor antes de que nadie lo explique. */}
        {!p.resumenDespuesDePortada && <Resumen>{p.resumen}</Resumen>}
      </header>

      {/* ── Portada ── */}
      <div className="mt-12">
        {p.media.tipo === "youtube" ? (
          <ReproductorYouTube id={p.media.id} titulo={p.titulo} />
        ) : (
          <div
            className="relative overflow-hidden rounded-2xl border border-[var(--color-borde)]"
            style={{ aspectRatio: "16 / 9" }}
          >
            {p.portada ? (
              <Grafico
                src={p.portada}
                sizes="(max-width: 1100px) 100vw, 1100px"
                priority
              />
            ) : (
              <Placeholder formato="horizontal" etiqueta="portada del caso" />
            )}
          </div>
        )}
      </div>

      {p.resumenDespuesDePortada && (
        <div className="mt-8">
          <Resumen>{p.resumen}</Resumen>
        </div>
      )}

      {/* ── Contexto general del proyecto ──
          Sustituye al bloque de tres métricas: un título con el párrafo
          que lo acompaña. */}
      {p.contexto && (
        <section className="mt-14 md:mt-20 grid gap-8 md:gap-16 md:grid-cols-2">
          <h2 className="display text-2xl md:text-4xl text-[var(--color-crema)] max-w-[14ch]">
            {p.contexto.titulo}
          </h2>
          <div className="space-y-4 md:pt-2">
            {p.contexto.parrafos.map((t, i) => (
              <p
                key={i}
                className="text-[15px] leading-relaxed text-[color-mix(in_srgb,#eeebe3_78%,transparent)]"
              >
                {t}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Relato adicional, si la pieza lo trae */}
      {p.descripcion.length > 0 && (
        <div className="mt-12 max-w-2xl space-y-5">
          {p.descripcion.map((parrafo, i) => (
            <p
              key={i}
              className="text-base leading-relaxed text-[color-mix(in_srgb,#eeebe3_82%,transparent)]"
            >
              {parrafo}
            </p>
          ))}
        </div>
      )}

      {/* ── Cuerpo modular ── */}
      {p.modulos && p.modulos.length > 0 && (
        <section className="mt-14 md:mt-20">
          <ModulosCaso modulos={p.modulos} />
        </section>
      )}

      {/* ── Servicios aplicados ── */}
      {servicios.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[var(--color-texto-tenue)]">
            Qué se aplicó
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {servicios.map((s) => (
              <Link
                key={s.id}
                href="/servicios"
                className="rounded-full border border-[var(--color-borde)] px-4 py-2 text-sm text-[var(--color-crema)] hover:border-[var(--color-menta)] hover:text-[var(--color-menta)] transition-colors"
              >
                {s.nombre}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Créditos ── */}
      {p.colaboradores && p.colaboradores.length > 0 && (
        <Colaboradores lista={p.colaboradores} />
      )}

      {/* ── Otras piezas del mismo cliente ── */}
      {hermanas.length > 0 && (
        <section className="mt-20 border-t border-[var(--color-borde)] pt-10">
          <h2 className="display-suave text-xl text-[var(--color-crema)]">
            También hicimos esto para {p.cliente}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 items-start">
            {hermanas.map((h) => (
              <Link
                key={h.slug}
                href={h.rubro === "reels" ? `/reels/${h.slug}` : `/trabajo/${h.slug}`}
                className="group"
              >
                <div
                  className="overflow-hidden rounded-xl border border-[var(--color-borde)]"
                  style={{
                    aspectRatio:
                      h.formato === "vertical"
                        ? "9 / 16"
                        : h.formato === "horizontal"
                        ? "16 / 9"
                        : "4 / 3",
                  }}
                >
                  <Placeholder formato={h.formato} compacto />
                </div>
                <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-[var(--color-menta)]">
                  {RUBROS.find((r) => r.id === h.rubro)?.corto}
                  {h.campana && ` · ${h.campana}`}
                </p>
                <h3 className="display-suave text-base text-[var(--color-crema)] group-hover:text-[var(--color-menta)] transition-colors">
                  {h.titulo}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Cierre y llamada a contacto ──
          Lo último que se lee. El caso ya convenció o no; aquí solo
          queda decir cómo se empieza uno igual. */}
      <section className="mt-20 rounded-2xl border border-[var(--color-borde)] bg-[var(--color-superficie)] px-6 py-12 md:px-12 md:py-16">
        {p.cierre && (
          <p className="display-suave max-w-[34ch] text-xl leading-snug text-[var(--color-crema)] md:text-2xl">
            {p.cierre}
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/contacto"
            className="rounded-full bg-[var(--color-menta)] px-6 py-3 text-sm font-medium text-[var(--color-profundo)] transition-colors hover:bg-[var(--color-crema)]"
          >
            Cuéntanos tu proyecto
          </Link>
          <a
            href={`mailto:${SITIO.correo}`}
            className="text-sm text-[var(--color-texto-tenue)] transition-colors hover:text-[var(--color-crema)]"
          >
            {SITIO.correo}
          </a>
        </div>
      </section>
    </article>
  );
}
