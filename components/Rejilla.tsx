"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import TarjetaTrabajo from "./TarjetaTrabajo";
import {
  visibles,
  seccionesActivas,
  RUBROS,
  TECNICAS,
  type Rubro,
  type Tecnica,
} from "@/lib/content";

/* Rejilla asimétrica tipo bento.

   Se resuelve con columnas CSS (masonry) en vez de una cuadrícula
   rígida, porque cada pieza conserva su proporción nativa: las
   verticales quedan altas y angostas, las horizontales anchas y
   cinematográficas. La composición sola comunica la mezcla de
   servicios, que era el objetivo del planteamiento. */

export default function Rejilla() {
  /* Dos niveles de filtro. El de arriba elige la sección; el de abajo
     solo aparece donde hay algo que precisar: Marca se parte entre
     completa y exprés, Reels entre grabado y animado.

     El estado arranca de la URL —?seccion=reels&sub=animacion— para
     que quien entra a un reel y regresa caiga en el mismo filtro del
     que salió, en vez de en el listado completo. */
  const params = useSearchParams();
  const [seccion, setSeccion] = useState<string>(params.get("seccion") ?? "todos");
  const [sub, setSub] = useState<string>(params.get("sub") ?? "todos");

  const secciones = useMemo(() => seccionesActivas(), []);
  const activa = secciones.find((s) => s.id === seccion);

  /* Qué se enseña en el segundo nivel: los rubros de la sección, o
     las técnicas si la sección se divide así. */
  const opciones = !activa
    ? []
    : activa.porTecnica
    ? TECNICAS.map((t) => ({ id: t.id as string, nombre: t.nombre }))
    : activa.rubros.length > 1
    ? activa.rubros.map((r) => ({
        id: r as string,
        nombre: RUBROS.find((x) => x.id === r)?.corto ?? r,
      }))
    : [];

  /* Cuántas piezas caen en una opción del segundo nivel */
  const enOpcion = (id: string) =>
    visibles().filter((x) =>
      activa?.porTecnica
        ? x.rubro === "reels" && (x.tecnica ?? "live-action") === id
        : x.rubro === id
    ).length;

  const lista = useMemo(() => {
    const todas = visibles();
    if (!activa) return todas;
    const deLaSeccion = todas.filter((x) => activa.rubros.includes(x.rubro));
    if (sub === "todos") return deLaSeccion;
    return activa.porTecnica
      ? deLaSeccion.filter((x) => (x.tecnica ?? "live-action") === sub)
      : deLaSeccion.filter((x) => x.rubro === sub);
  }, [activa, sub]);

  const elegir = (id: string) => {
    setSeccion(id);
    setSub("todos");
  };

  const cuenta = (rs: Rubro[]) => visibles().filter((x) => rs.includes(x.rubro)).length;

  /* Un reel se abre llevándose a dónde tiene que volver. Se manda la
     ruta entera y no los filtros sueltos: así el feed no tiene que
     saber nada de secciones ni de técnicas para regresar bien. */
  const volver = encodeURIComponent(
    `/trabajo?seccion=${seccion}${sub !== "todos" ? `&sub=${sub}` : ""}`
  );
  const rutaDe = (x: { slug: string; rubro: string }) =>
    x.rubro === "reels"
      ? `/reels/${x.slug}?volver=${volver}`
      : `/trabajo/${x.slug}`;

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

      {/* Segundo nivel: solo donde hay algo que precisar */}
      {opciones.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 [animation:aparecer_.3s_var(--ease-eci)]">
          <Sub activo={sub === "todos"} onClick={() => setSub("todos")}>
            Todas
          </Sub>
          {opciones.map((o) => (
            <Sub key={o.id} activo={sub === o.id} onClick={() => setSub(o.id)}>
              {o.nombre} <span className="opacity-50">{enOpcion(o.id)}</span>
            </Sub>
          ))}
        </div>
      )}

      <div className="mb-8" />

      <div
        key={seccion + sub}
        className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 md:gap-4 [animation:aparecer_.4s_var(--ease-eci)]"
      >
        {lista.map((p) => (
          <TarjetaTrabajo key={p.slug} p={p} href={rutaDe(p)} />
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
