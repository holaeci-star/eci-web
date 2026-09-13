"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Placeholder from "./Placeholder";
import { listar, reels, type Pieza } from "@/lib/content";
import { urlMedia } from "@/lib/media";

/* Feed vertical 9:16.

   Los cuatro puntos del planteamiento:
   1. scroll-snap nativo de CSS, sin librería.
   2. Solo tres reproductores montados: anterior, actual y siguiente.
   3. El siguiente empieza a bufferear cuando el actual está activo.
   4. UNA sola capa de overlay, fija, cuyo contenido se cruza al
      cambiar de video — no un overlay por pieza.

   La guía de zona segura dibuja las franjas que ocupa la interfaz
   (180 px arriba, 420 px abajo, 140 px a la derecha sobre un cuadro
   de 1080 × 1920) para comprobar si el material ya exportado choca
   con ellas. */

const LISTA = reels();

const FRANJA = {
  superior: 180 / 1920,
  inferior: 420 / 1920,
  derecha: 140 / 1080,
};

export default function FeedReels({ inicial }: { inicial?: string }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLDivElement | null)[]>([]);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const [activo, setActivo] = useState(() => {
    const i = LISTA.findIndex((p) => p.slug === inicial);
    return i >= 0 ? i : 0;
  });
  const [sonido, setSonido] = useState(false);
  const [guia, setGuia] = useState(false);
  /* Videos que no cargaron: se sustituyen por el marcador */
  const [fallidos, setFallidos] = useState<Record<number, boolean>>({});
  /* Hasta que el video activo pueda reproducirse, ninguno de sus
     vecinos pide un solo byte. Antes los tres montados atacaban la red
     a la vez y el primero tardaba de más en arrancar. */
  const [activoListo, setActivoListo] = useState(false);

  /* Posiciona el feed en la pieza pedida cuando se entra en frío */
  useEffect(() => {
    if (!inicial) return;
    const i = LISTA.findIndex((p) => p.slug === inicial);
    if (i > 0) slides.current[i]?.scrollIntoView({ behavior: "instant" as ScrollBehavior });
  }, [inicial]);

  /* Detecta la pieza visible */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            const i = Number((e.target as HTMLElement).dataset.indice);
            setActivo(i);
          }
        });
      },
      { threshold: [0.6], root: contenedor.current }
    );
    slides.current.forEach((s) => s && obs.observe(s));
    return () => obs.disconnect();
  }, []);

  /* Reproduce el activo, pausa el resto */
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === activo) {
        v.muted = !sonido;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
    // La URL sigue a la pieza visible, para que sea compartible
    const p = LISTA[activo];
    if (p) window.history.replaceState(null, "", `/reels/${p.slug}`);
    setActivoListo(false);
  }, [activo, sonido]);

  /* Teclado */
  const mover = useCallback((d: number) => {
    const i = Math.min(Math.max(activo + d, 0), LISTA.length - 1);
    slides.current[i]?.scrollIntoView({ behavior: "smooth" });
  }, [activo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); mover(1); }
      if (e.key === "ArrowUp") { e.preventDefault(); mover(-1); }
      if (e.key === "m") setSonido((s) => !s);
      if (e.key === "g") setGuia((g) => !g);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mover]);

  const pieza = LISTA[activo];

  return (
    <div className="fixed inset-0 bg-black">
      <div
        ref={contenedor}
        className="feed sin-barra h-full w-full overflow-y-scroll"
      >
        {LISTA.map((p, i) => {
          const montado = Math.abs(i - activo) <= 1; // solo 3 reproductores
          return (
            <div
              key={p.slug}
              data-indice={i}
              ref={(el) => { slides.current[i] = el; }}
              className="relative h-[100dvh] w-full flex items-center justify-center"
            >
              <div className="relative h-full" style={{ aspectRatio: "9 / 16" }}>
                {/* Marcador de fondo: sostiene el encuadre mientras el
                    video carga, y se queda si el archivo no está
                    disponible — los masters no viven en el repositorio. */}
                <div className="absolute inset-0">
                  <Placeholder formato="vertical" etiqueta="reel · 1080 × 1920" />
                </div>

                {montado && p.media.tipo === "local" && !fallidos[i] && (
                  <video
                    ref={(el) => { videos.current[i] = el; }}
                    src={urlMedia(p.media.src)}
                    poster={p.tarjeta ? urlMedia(p.tarjeta) : undefined}
                    loop
                    muted={!sonido || i !== activo}
                    playsInline
                    preload={
                      i === activo
                        ? "auto"
                        : activoListo && i === activo + 1
                        ? "metadata"
                        : "none"
                    }
                    onCanPlay={() => { if (i === activo) setActivoListo(true); }}
                    onError={() => setFallidos((f) => ({ ...f, [i]: true }))}
                    className="relative h-full w-full object-cover"
                  />
                )}

                {fallidos[i] && (
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-8 text-center">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-naranja)]">
                      Video pendiente
                    </p>
                    <p className="mt-2 text-sm text-[color-mix(in_srgb,#eeebe3_70%,transparent)]">
                      El master vive fuera del repositorio. Se conecta cuando
                      los reels estén reexportados y alojados.
                    </p>
                  </div>
                )}

                {guia && <GuiaZonaSegura />}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── UNA sola capa de interfaz, fija ── */}
      <Interfaz
        pieza={pieza}
        indice={activo}
        total={LISTA.length}
        sonido={sonido}
        guia={guia}
        onSonido={() => setSonido((s) => !s)}
        onGuia={() => setGuia((g) => !g)}
      />
    </div>
  );
}

function GuiaZonaSegura() {
  const banda = "absolute bg-[color-mix(in_srgb,#e27240_26%,transparent)] border-[var(--color-naranja)]";
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div
        className={`${banda} inset-x-0 top-0 border-b`}
        style={{ height: `${FRANJA.superior * 100}%` }}
      >
        <span className="absolute bottom-1 left-2 text-[10px] text-[var(--color-crema)]">180 px · navegación</span>
      </div>
      <div
        className={`${banda} inset-x-0 bottom-0 border-t`}
        style={{ height: `${FRANJA.inferior * 100}%` }}
      >
        <span className="absolute top-1 left-2 text-[10px] text-[var(--color-crema)]">420 px · título, cliente y métricas</span>
      </div>
      <div
        className={`${banda} inset-y-0 right-0 border-l`}
        style={{ width: `${FRANJA.derecha * 100}%` }}
      />
      <div className="absolute inset-0 border-2 border-dashed border-[color-mix(in_srgb,#a3eadc_50%,transparent)] m-[1px]" />
    </div>
  );
}

function Interfaz({
  pieza, indice, total, sonido, guia, onSonido, onGuia,
}: {
  pieza?: Pieza; indice: number; total: number;
  sonido: boolean; guia: boolean;
  onSonido: () => void; onGuia: () => void;
}) {
  if (!pieza) return null;
  return (
    <>
      {/* Superior */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between p-4 md:p-6">
        <Link
          href="/reels"
          className="pointer-events-auto rounded-full bg-[color-mix(in_srgb,#111827_70%,transparent)] px-4 py-2 text-sm text-[var(--color-crema)] backdrop-blur-md hover:bg-[var(--color-crema)] hover:text-[var(--color-profundo)] transition-colors"
        >
          ← Todos los reels
        </Link>
        <div className="pointer-events-auto flex gap-2">
          <button
            onClick={onGuia}
            className={`rounded-full px-3 py-2 text-xs backdrop-blur-md transition-colors ${
              guia
                ? "bg-[var(--color-naranja)] text-[var(--color-profundo)]"
                : "bg-[color-mix(in_srgb,#111827_70%,transparent)] text-[var(--color-crema)]"
            }`}
            title="Tecla G"
          >
            Zona segura
          </button>
          <button
            onClick={onSonido}
            className="rounded-full bg-[color-mix(in_srgb,#111827_70%,transparent)] px-3 py-2 text-xs text-[var(--color-crema)] backdrop-blur-md"
            title="Tecla M"
          >
            {sonido ? "Sonido activo" : "Silenciado"}
          </button>
        </div>
      </div>

      {/* Progreso lateral */}
      <div className="pointer-events-none absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-1.5 md:flex">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-6 w-[3px] rounded-full transition-colors ${
              i === indice ? "bg-[var(--color-menta)]" : "bg-[color-mix(in_srgb,#eeebe3_28%,transparent)]"
            }`}
          />
        ))}
      </div>

      {/* Inferior — el contenido se cruza al cambiar de pieza */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/85 via-black/45 to-transparent pt-24 pb-6 px-4 md:px-8">
        <div key={pieza.slug} className="mx-auto max-w-3xl [animation:aparecer_.45s_var(--ease-eci)]">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-menta)]">
            {pieza.cliente}
            {pieza.campana && (
              <span className="ml-2 text-[var(--color-texto-tenue)]">· campaña {pieza.campana}</span>
            )}
          </p>
          {pieza.tecnica === "animacion" && (
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[color-mix(in_srgb,#eeebe3_55%,transparent)]">
              Animación
            </p>
          )}
          {pieza.agencias && pieza.agencias.length > 0 && (
            <p className="mt-1 text-[11px] text-[color-mix(in_srgb,#eeebe3_62%,transparent)]">
              Con {listar(pieza.agencias)}
            </p>
          )}
          <h2 className="display mt-2 text-3xl md:text-5xl text-[var(--color-crema)]">
            {pieza.titulo}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[color-mix(in_srgb,#eeebe3_78%,transparent)]">
            {pieza.resumen}
          </p>
          {pieza.metricas.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
              {pieza.metricas.map((m) => (
                <div key={m.etiqueta}>
                  <span className="display-suave block text-xl text-[var(--color-menta)]">{m.valor}</span>
                  <span className="text-[11px] text-[var(--color-texto-tenue)]">{m.etiqueta}</span>
                </div>
              ))}
            </div>
          )}
          {pieza.media.tipo === "local" && (
            <p className="mt-4 text-[10px] text-[var(--color-naranja)]">
              Archivo sin optimizar: {pieza.media.pesoMB} MB · el objetivo del manual es 6–12 MB
            </p>
          )}
        </div>
      </div>
    </>
  );
}
