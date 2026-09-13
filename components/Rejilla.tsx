"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Grafico from "./Grafico";
import Placeholder from "./Placeholder";
import {
  visibles,
  seccionesActivas,
  RUBROS,
  MEDIDAS,
  iniciales,
  type Pieza,
  type Rubro,
} from "@/lib/content";
import { urlMedia } from "@/lib/media";

/* Rejilla asimétrica tipo bento.

   Se resuelve con columnas CSS (masonry) en vez de una cuadrícula
   rígida, porque cada pieza conserva su proporción nativa: las
   verticales quedan altas y angostas, las horizontales anchas y
   cinematográficas. La composición sola comunica la mezcla de
   servicios, que era el objetivo del planteamiento. */

const PROPORCION: Record<string, string> = {
  vertical: "9 / 16",
  horizontal: "16 / 9",
  estatico: "4 / 3",
};

/* Recuadro con el logo reducido del cliente.
   Mientras no exista el SVG, se dibuja un monograma con sus
   iniciales — mismo tamaño y misma caja, para poder juzgar el diseño. */
function CajaLogo({ pieza, tam = 34 }: { pieza: Pieza; tam?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-md border border-[color-mix(in_srgb,#eeebe3_22%,transparent)] bg-[color-mix(in_srgb,#111827_78%,transparent)] backdrop-blur-sm overflow-hidden"
      style={{ width: tam, height: tam }}
    >
      {pieza.logo ? (
        /* Las reducciones nuevas traen su propio fondo de color y
           llenan la caja; las que vienen sobre transparente se
           dejan con aire alrededor. */
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
          style={{ fontSize: tam * 0.4 }}
        >
          {iniciales(pieza.cliente)}
        </span>
      )}
    </span>
  );
}

function Tarjeta({ p }: { p: Pieza }) {
  const [hover, setHover] = useState(false);
  /* Una vez que el cursor entró, la imagen de hover ya se pidió y se
     queda montada; no tiene sentido volver a descargarla. */
  const [tocada, setTocada] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const medidas = MEDIDAS[p.formato];

  const alEntrar = () => {
    setHover(true);
    setTocada(true);
  };

  /* En el primer hover el <video> todavía no tiene src: se le pone al
     re-renderizar. Y con preload="none" el archivo no se pide hasta
     que alguien llame a play(), así que arrancarlo desde el manejador
     del ratón no sirve —no habría nada que reproducir—. Se hace aquí,
     ya con el src puesto. Detrás sigue la imagen base, no un hueco. */
  useEffect(() => {
    const v = video.current;
    if (!v || !v.getAttribute("src")) return;
    if (hover) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [hover, tocada]);
  const alSalir = () => setHover(false);

  /* Qué se enseña al pasar el cursor, en orden de prioridad:
       1. el video de la propia pieza (reels y comerciales),
       2. una animación de marca en MP4 (los GIF convertidos),
       3. una segunda imagen.
     Los dos primeros comparten el mismo <video>, así que la lógica de
     reproducción no se duplica. */
  const fuenteVideo =
    p.media.tipo === "local"
      ? (p.media as { src: string }).src
      : p.tarjetaHoverVideo;
  const esVideoLocal = p.media.tipo === "local";

  return (
    <Link
      href={p.rubro === "reels" ? `/reels/${p.slug}` : `/trabajo/${p.slug}`}
      className="group mb-3 md:mb-4 block break-inside-avoid"
      onMouseEnter={alEntrar}
      onMouseLeave={alSalir}
    >
      <div
        className="relative overflow-hidden rounded-xl border border-[var(--color-borde)] bg-[var(--color-superficie)]"
        style={{ aspectRatio: PROPORCION[p.formato] }}
      >
        {/* Recurso base */}
        {p.tarjeta ? (
          <Grafico src={p.tarjeta} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw" />
        ) : (
          <Placeholder formato={p.formato} etiqueta="recurso base" variante={1} />
        )}

        {/* Segundo recurso: aparece al pasar el cursor.
            En las piezas de video es el preview mudo; en las estáticas
            es la segunda imagen, del mismo tamaño que la base. */}
        {fuenteVideo ? (
          <video
            ref={video}
            src={tocada ? urlMedia(fuenteVideo) : undefined}
            muted
            loop
            playsInline
            preload="none"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              hover ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              hover ? "opacity-100" : "opacity-0"
            }`}
          >
            {p.tarjetaHover ? (
              /* Solo se descarga cuando el cursor entra por primera vez.
                 Antes se bajaban las dos imágenes de cada tarjeta aunque
                 nadie pasara por encima: el doble de peso en la rejilla. */
              tocada && <Grafico src={p.tarjetaHover} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw" />
            ) : (
              <Placeholder formato={p.formato} etiqueta="segundo recurso" variante={2} esHover />
            )}
          </div>
        )}

        {/* Degradado de lectura.

           Va más alto y más opaco de lo que pediría una portada oscura,
           porque los casos de marca llegan sobre fondos claros —crema,
           blanco— y ahí un velo suave deja el nombre del cliente casi
           ilegible. Sobre material oscuro no se nota la diferencia. */}
        <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[var(--color-profundo)] via-[color-mix(in_srgb,#111827_78%,transparent)] to-transparent" />

        {/* Etiqueta de medidas — para juzgar tamaños de un vistazo */}
        <span className="absolute top-3 left-3 rounded-full bg-[color-mix(in_srgb,var(--color-profundo)_75%,transparent)] px-2.5 py-1 text-[10px] tracking-wider text-[var(--color-menta)] backdrop-blur-sm">
          {medidas.w} × {medidas.h}
        </span>

        {esVideoLocal && (
          <span className="absolute top-3 right-3 rounded-full bg-[color-mix(in_srgb,var(--color-naranja)_85%,transparent)] px-2.5 py-1 text-[10px] font-medium tracking-wider text-[var(--color-profundo)]">
            {(p.media as { pesoMB: number }).pesoMB} MB
          </span>
        )}

        {/* ── Bloque de identidad del cliente ──
            Logo reducido en su recuadro, nombre del cliente resaltado
            y la categoría debajo. */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex items-center gap-2.5">
            <CajaLogo pieza={p} />
            <div className="min-w-0">
              <p className="display-suave truncate text-[15px] leading-tight text-[var(--color-menta)]">
                {p.cliente}
              </p>
              <p className="truncate text-[10px] uppercase tracking-[0.14em] text-[color-mix(in_srgb,#eeebe3_58%,transparent)]">
                {p.categoria}
              </p>
            </div>
          </div>

          {/* Sin resumen: en la rejilla el título y el cliente bastan para
              decidir si entras, y el párrafo apareciendo al pasar el cursor
              ensuciaba la vista de conjunto. El resumen sigue vivo dentro
              del caso y en el feed de reels. */}
          <h3 className="display-suave mt-3 text-lg leading-tight text-[var(--color-crema)]">
            {p.titulo}
          </h3>
        </div>
      </div>
    </Link>
  );
}

export default function Rejilla() {
  /* Dos niveles de filtro. El de arriba elige la sección —Marca,
     Reels, Foto—; el de abajo solo aparece cuando la sección cubre
     más de un rubro, como Marca, que junta completa y exprés. */
  const [seccion, setSeccion] = useState<string>("todos");
  const [rubro, setRubro] = useState<Rubro | "todos">("todos");

  const secciones = useMemo(() => seccionesActivas(), []);
  const activa = secciones.find((s) => s.id === seccion);

  const lista = useMemo(() => {
    const todas = visibles();
    if (!activa) return todas;
    if (rubro !== "todos") return todas.filter((p) => p.rubro === rubro);
    return todas.filter((p) => activa.rubros.includes(p.rubro));
  }, [activa, rubro]);

  const elegir = (id: string) => {
    setSeccion(id);
    setRubro("todos");
  };

  const cuenta = (rs: Rubro[]) => visibles().filter((p) => rs.includes(p.rubro)).length;

  return (
    <>
      {/* Filtro: reordena en vivo, no navega a otra página */}
      <div className="flex flex-wrap gap-2">
        <Boton activo={seccion === "todos"} onClick={() => elegir("todos")}>
          Todo <span className="opacity-50">{visibles().length}</span>
        </Boton>
        {secciones.map((sec) => (
          <Boton key={sec.id} activo={seccion === sec.id} onClick={() => elegir(sec.id)}>
            {sec.corto} <span className="opacity-50">{cuenta(sec.rubros)}</span>
          </Boton>
        ))}
      </div>

      {/* Segundo nivel: solo donde la sección junta varios rubros */}
      {activa && activa.rubros.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2 [animation:aparecer_.3s_var(--ease-eci)]">
          <Sub activo={rubro === "todos"} onClick={() => setRubro("todos")}>
            Todas
          </Sub>
          {activa.rubros.map((r) => (
            <Sub key={r} activo={rubro === r} onClick={() => setRubro(r)}>
              {RUBROS.find((x) => x.id === r)?.corto}{" "}
              <span className="opacity-50">{cuenta([r])}</span>
            </Sub>
          ))}
        </div>
      )}

      <div className="mb-8" />

      <div
        key={seccion + rubro}
        className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 md:gap-4 [animation:aparecer_.4s_var(--ease-eci)]"
      >
        {lista.map((p) => (
          <Tarjeta key={p.slug} p={p} />
        ))}
      </div>
    </>
  );
}

/* Segundo nivel: subrayado en vez de píldora, para que se lea como
   una precisión del filtro de arriba y no como otro filtro igual. */
function Sub({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`border-b pb-0.5 text-[13px] transition-colors ${
        activo
          ? "border-[var(--color-menta)] text-[var(--color-menta)]"
          : "border-transparent text-[var(--color-texto-tenue)] hover:text-[var(--color-crema)]"
      }`}
    >
      {children}
    </button>
  );
}

function Boton({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
        activo
          ? "border-[var(--color-menta)] bg-[var(--color-menta)] text-[var(--color-profundo)]"
          : "border-[var(--color-borde)] text-[var(--color-texto-tenue)] hover:border-[var(--color-crema)] hover:text-[var(--color-crema)]"
      }`}
    >
      {children}
    </button>
  );
}
