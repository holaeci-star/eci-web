"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Placeholder from "./Placeholder";
import { reels, iniciales, type Pieza, type Tecnica } from "@/lib/content";
import { urlMedia } from "@/lib/media";

/* Índice de reels.

   Antes, entrar a Reels caía directo en el feed a pantalla completa:
   el primer video arrancaba y no había forma de ver qué más hay ni de
   elegir. Ahora primero se ve todo el catálogo en su formato —9:16,
   uniforme, con la portada de cada pieza— y desde ahí se entra al
   feed en el reel que se eligió.

   El filtro separa por técnica porque un reel animado y uno grabado
   son oficios distintos: quien viene buscando animación rara vez
   quiere ver rodaje, y al revés. */

const TECNICAS: { id: Tecnica | "todos"; nombre: string }[] = [
  { id: "todos", nombre: "Todos" },
  { id: "live-action", nombre: "Live action" },
  { id: "animacion", nombre: "Animación" },
];

function Tarjeta({ p }: { p: Pieza }) {
  return (
    <Link href={`/reels/${p.slug}`} className="group block">
      <div
        className="relative overflow-hidden rounded-xl border border-[var(--color-borde)] bg-[var(--color-superficie)]"
        style={{ aspectRatio: "9 / 16" }}
      >
        {p.tarjeta ? (
          <Image
            src={urlMedia(p.tarjeta)}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            quality={85}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <Placeholder formato="vertical" etiqueta="reel · 1080 × 1920" />
        )}

        {/* Degradado de lectura */}
        <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[var(--color-profundo)] via-[color-mix(in_srgb,#111827_72%,transparent)] to-transparent" />

        {/* La técnica, arriba, solo en los animados: es la excepción */}
        {p.tecnica === "animacion" && (
          <span className="absolute left-3 top-3 rounded-full bg-[color-mix(in_srgb,#111827_75%,transparent)] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--color-menta)] backdrop-blur-sm">
            Animación
          </span>
        )}

        {/* Señal de reproducción, al pasar el cursor */}
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[color-mix(in_srgb,#eeebe3_90%,transparent)] text-[var(--color-profundo)]">
            ▶
          </span>
        </span>

        <div className="absolute inset-x-0 bottom-0 p-3.5">
          <p className="truncate text-[10px] uppercase tracking-[0.14em] text-[var(--color-menta)]">
            {p.cliente}
          </p>
          <h3 className="display-suave mt-1 text-sm leading-tight text-[var(--color-crema)] line-clamp-2">
            {p.titulo}
          </h3>
        </div>
      </div>
    </Link>
  );
}

export default function RejillaReels() {
  const [tecnica, setTecnica] = useState<Tecnica | "todos">("todos");
  const todos = useMemo(() => reels(), []);

  const lista = useMemo(
    () =>
      tecnica === "todos"
        ? todos
        : todos.filter((p) => (p.tecnica ?? "live-action") === tecnica),
    [todos, tecnica]
  );

  const cuenta = (t: Tecnica | "todos") =>
    t === "todos"
      ? todos.length
      : todos.filter((p) => (p.tecnica ?? "live-action") === t).length;

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {TECNICAS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTecnica(t.id)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              tecnica === t.id
                ? "border-[var(--color-menta)] bg-[var(--color-menta)] text-[var(--color-profundo)]"
                : "border-[var(--color-borde)] text-[var(--color-texto-tenue)] hover:border-[var(--color-crema)] hover:text-[var(--color-crema)]"
            }`}
          >
            {t.nombre} <span className="opacity-50">{cuenta(t.id)}</span>
          </button>
        ))}
      </div>

      <div
        key={tecnica}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5 [animation:aparecer_.4s_var(--ease-eci)]"
      >
        {lista.map((p) => (
          <Tarjeta key={p.slug} p={p} />
        ))}
      </div>
    </>
  );
}
