"use client";

import { useCallback, useEffect, useState } from "react";
import Grafico from "./Grafico";
import Placeholder from "./Placeholder";
import { imagenesDe, type Imagen, type Modulo } from "@/lib/content";
import { urlMedia } from "@/lib/media";
import { useCargaDiferida } from "@/lib/carga-diferida";

/* Cuerpo del caso de estudio, armado por módulos.

   Tres variantes que se combinan libremente y en cualquier orden:

   1. cuadricula — dos imágenes recortadas a cuadrada, lado a lado.
   2. completa   — una imagen que cubre el ancho de las dos anteriores.
   3. texto      — título grande a la izquierda y párrafos a la derecha,
                   con la opción de llevar una imagen al costado.

   DOS TAMAÑOS POR FOTO. El layout recorta cada imagen a la proporción
   del módulo para que la interfaz quede ordenada y pareja. Al hacer
   clic, el visor la abre COMPLETA, en su proporción original, y se
   recorre con las flechas. Por eso cada imagen guarda sus medidas
   reales aparte de la caja donde vive. */

/* Capa animada sobre una imagen.

   Las piezas de marca traen GIF —patrones, mockups en movimiento— que
   convertimos a MP4. Se monta encima de la imagen, que hace de póster,
   y arranca solo cuando el módulo entra en pantalla: un caso largo
   puede llevar dos o tres y no tiene sentido bajarlos todos de golpe. */
function CapaVideo({ src, ajuste }: { src: string; ajuste: string }) {
  const { ref, cargar } = useCargaDiferida<HTMLDivElement>("100px");
  const [listo, setListo] = useState(false);

  return (
    <div ref={ref} className="absolute inset-0">
      {cargar && (
        <video
          src={urlMedia(src)}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setListo(true)}
          className={"absolute inset-0 h-full w-full " + ajuste +
            " transition-opacity duration-500 " + (listo ? "opacity-100" : "opacity-0")}
        />
      )}
    </div>
  );
}

function Pie({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2.5 text-[11px] uppercase tracking-[0.14em] text-[var(--color-texto-tenue)]">
      {children}
    </p>
  );
}

/* Caja recortada, clicable */
/* Cuánto mide la caja en pantalla, para que next/image pida el
   derivado del tamaño correcto. El caso vive en una columna de
   1100 px: una cuadrícula parte ese ancho en dos, una caja completa
   lo ocupa entero. */
const ANCHO_MEDIO = "(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 520px";
const ANCHO_TOTAL = "(max-width: 1100px) 100vw, 1050px";

function Recorte({
  imagen,
  proporcion,
  etiqueta,
  variante = 1,
  sizes = ANCHO_MEDIO,
  onAbrir,
}: {
  imagen: Imagen;
  proporcion: string;
  etiqueta: string;
  variante?: 1 | 2;
  sizes?: string;
  onAbrir: () => void;
}) {
  const recortada =
    Math.abs(imagen.w / imagen.h - evalProporcion(proporcion)) > 0.02;

  return (
    <button
      type="button"
      onClick={onAbrir}
      className="group/img relative block w-full cursor-zoom-in overflow-hidden rounded-xl border border-[var(--color-borde)] text-left"
      style={{ aspectRatio: proporcion }}
      aria-label={`Abrir ${imagen.pie ?? "imagen"} en tamaño original`}
    >
      {imagen.src ? (
        <Grafico
          src={imagen.src}
          alt={imagen.pie ?? ""}
          sizes={sizes}
          className="object-cover transition-transform duration-700 group-hover/img:scale-[1.03]"
        />
      ) : (
        <Placeholder
          formato="estatico"
          medidas={{ w: imagen.w, h: imagen.h }}
          etiqueta={etiqueta}
          variante={variante}
        />
      )}
      {/* La animación va encima: la imagen queda de póster */}
      {imagen.video && <CapaVideo src={imagen.video} ajuste="object-cover" />}

      {/* Aviso de recorte: solo cuando el original no coincide con la caja */}
      {recortada && (
        <span className="absolute left-3 top-3 rounded-full bg-[color-mix(in_srgb,#111827_78%,transparent)] px-2.5 py-1 text-[10px] tracking-wider text-[var(--color-naranja)] backdrop-blur-sm">
          recortada
        </span>
      )}
      <span className="absolute right-3 top-3 rounded-full bg-[color-mix(in_srgb,#111827_78%,transparent)] px-2.5 py-1 text-[10px] tracking-wider text-[var(--color-crema)] opacity-0 backdrop-blur-sm transition-opacity group-hover/img:opacity-100">
        Ver original
      </span>
    </button>
  );
}

function evalProporcion(p: string) {
  const [a, b] = p.split("/").map((n) => parseFloat(n.trim()));
  return a / b;
}

/* ── Visor a pantalla completa ── */
function Visor({
  imagenes,
  indice,
  onCerrar,
  onMover,
}: {
  imagenes: Imagen[];
  indice: number;
  onCerrar: () => void;
  onMover: (d: number) => void;
}) {
  const img = imagenes[indice];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
      if (e.key === "ArrowRight") onMover(1);
      if (e.key === "ArrowLeft") onMover(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onCerrar, onMover]);

  if (!img) return null;

  const vertical = img.h > img.w;

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-[color-mix(in_srgb,#111827_96%,black)]"
      role="dialog"
      aria-modal="true"
    >
      {/* Barra superior */}
      <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-3 md:px-6">
        <span className="text-xs tracking-wider text-[var(--color-texto-tenue)]">
          {indice + 1} / {imagenes.length}
        </span>
        <span className="rounded-full border border-[var(--color-borde)] px-3 py-1 text-[11px] tracking-wider text-[var(--color-menta)]">
          original · {img.w} × {img.h}
        </span>
        <button
          onClick={onCerrar}
          className="rounded-full bg-[color-mix(in_srgb,#eeebe3_10%,transparent)] px-4 py-2 text-sm text-[var(--color-crema)] transition-colors hover:bg-[var(--color-crema)] hover:text-[var(--color-profundo)]"
        >
          Cerrar
        </button>
      </div>

      {/* Imagen completa, sin recorte */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 md:px-20">
        <Flecha lado="izq" onClick={() => onMover(-1)} />
        <div
          className="relative max-h-full overflow-hidden rounded-lg border border-[var(--color-borde)]"
          style={{
            aspectRatio: `${img.w} / ${img.h}`,
            height: vertical ? "100%" : undefined,
            width: vertical ? undefined : "min(100%, 1400px)",
            maxWidth: "100%",
          }}
        >
          {img.src ? (
            <Grafico
              src={img.src}
              alt={img.pie ?? ""}
              sizes="100vw"
              priority
              className="object-contain"
            />
          ) : (
            <Placeholder
              formato="estatico"
              medidas={{ w: img.w, h: img.h }}
              etiqueta="tamaño original"
            />
          )}
          {img.video && <CapaVideo src={img.video} ajuste="object-contain" />}
        </div>
        <Flecha lado="der" onClick={() => onMover(1)} />
      </div>

      {/* Pie */}
      {img.pie && (
        <p className="shrink-0 px-4 pb-6 text-center text-sm text-[color-mix(in_srgb,#eeebe3_72%,transparent)] md:pb-8">
          {img.pie}
        </p>
      )}
    </div>
  );
}

function Flecha({ lado, onClick }: { lado: "izq" | "der"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={lado === "izq" ? "Anterior" : "Siguiente"}
      className={`absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[color-mix(in_srgb,#eeebe3_12%,transparent)] text-[var(--color-crema)] backdrop-blur-sm transition-colors hover:bg-[var(--color-crema)] hover:text-[var(--color-profundo)] ${
        lado === "izq" ? "left-2 md:left-6" : "right-2 md:right-6"
      }`}
    >
      {lado === "izq" ? "←" : "→"}
    </button>
  );
}

export default function ModulosCaso({ modulos }: { modulos: Modulo[] }) {
  const galeria = imagenesDe(modulos);
  const [abierta, setAbierta] = useState<number | null>(null);

  const mover = useCallback(
    (d: number) =>
      setAbierta((i) =>
        i === null ? i : (i + d + galeria.length) % galeria.length
      ),
    [galeria.length]
  );

  /* Contador que recorre las imágenes en el mismo orden que
     `imagenesDe`, para que el índice del visor coincida. */
  let n = -1;
  const siguiente = () => ++n;

  return (
    <>
      <div className="space-y-6 md:space-y-8">
        {modulos.map((m, i) => {
          /* ── 1 · Cuadrícula de dos cuadradas ── */
          if (m.tipo === "cuadricula") {
            return (
              <div key={i} className="grid gap-6 md:gap-8 sm:grid-cols-2">
                {m.imagenes.map((img, j) => {
                  const idx = siguiente();
                  return (
                    <figure key={j}>
                      <Recorte
                        imagen={img}
                        proporcion={m.proporcion ?? "1 / 1"}
                        etiqueta="cuadrada"
                        variante={j === 1 ? 2 : 1}
                        onAbrir={() => setAbierta(idx)}
                      />
                      {img.pie && <Pie>{img.pie}</Pie>}
                    </figure>
                  );
                })}
              </div>
            );
          }

          /* ── 2 · Imagen a ancho completo ── */
          if (m.tipo === "completa") {
            const caja =
              m.alto === "panoramico"
                ? { proporcion: "12 / 5", etiqueta: "panorámica" }
                : m.alto === "cuadro"
                ? { proporcion: "4 / 3", etiqueta: "ancho completo · 4:3" }
                : { proporcion: "16 / 9", etiqueta: "ancho completo" };
            const idx = siguiente();
            return (
              <figure key={i}>
                <Recorte
                  imagen={m.imagen}
                  proporcion={caja.proporcion}
                  etiqueta={caja.etiqueta}
                  sizes={ANCHO_TOTAL}
                  onAbrir={() => setAbierta(idx)}
                />
                {m.imagen.pie && <Pie>{m.imagen.pie}</Pie>}
              </figure>
            );
          }

          /* ── 3 · Bloque de texto ── */
          if (m.imagen) {
            const idx = siguiente();
            const img = m.imagen;
            return (
              <div key={i} className="grid items-start gap-8 md:gap-10 py-6 md:grid-cols-2">
                <div>
                  <h3 className="display text-2xl md:text-3xl text-[var(--color-crema)] max-w-[16ch]">
                    {m.titulo}
                  </h3>
                  <div className="mt-6 space-y-4">
                    {m.parrafos.map((t, k) => (
                      <p
                        key={k}
                        className="text-[15px] leading-relaxed text-[color-mix(in_srgb,#eeebe3_78%,transparent)]"
                      >
                        {t}
                      </p>
                    ))}
                  </div>
                </div>
                <figure>
                  <Recorte
                    imagen={img}
                    proporcion="1 / 1"
                    etiqueta="cuadrada"
                    variante={2}
                    onAbrir={() => setAbierta(idx)}
                  />
                  {img.pie && <Pie>{img.pie}</Pie>}
                </figure>
              </div>
            );
          }

          // Título a la izquierda, párrafos a la derecha
          return (
            <div key={i} className="grid gap-8 md:gap-16 py-8 md:py-12 md:grid-cols-2">
              <h3 className="display text-2xl md:text-4xl text-[var(--color-crema)] max-w-[14ch]">
                {m.titulo}
              </h3>
              <div className="space-y-4 md:pt-2">
                {m.parrafos.map((t, k) => (
                  <p
                    key={k}
                    className="text-[15px] leading-relaxed text-[color-mix(in_srgb,#eeebe3_78%,transparent)]"
                  >
                    {t}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {abierta !== null && (
        <Visor
          imagenes={galeria}
          indice={abierta}
          onCerrar={() => setAbierta(null)}
          onMover={mover}
        />
      )}
    </>
  );
}
