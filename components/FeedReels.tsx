"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { listar, reels, TECNICAS, type Pieza, type Tecnica } from "@/lib/content";
import { urlMedia } from "@/lib/media";

/* Feed vertical 9:16.

   Los cuatro puntos del planteamiento:
   1. scroll-snap nativo de CSS, sin librería.
   2. Solo tres reproductores montados: anterior, actual y siguiente.
   3. El siguiente empieza a bufferear cuando el actual está activo.
   4. UNA sola capa de overlay, fija, cuyo contenido se cruza al
      cambiar de video — no un overlay por pieza.

   El filtro por técnica vive aquí dentro y no en una pantalla previa.
   Antes había un catálogo de reels en cuadrícula del que se elegía uno
   para entrar al feed; eran dos pasos para ver un video de quince
   segundos. Ahora se entra directo y, si alguien quiere solo animación
   o solo rodaje, lo dice sin salirse. */

const TODOS = reels();

const FILTROS: { id: Tecnica | "todos"; nombre: string }[] = [
  { id: "todos", nombre: "Todos" },
  ...TECNICAS.map((t) => ({ id: t.id as Tecnica | "todos", nombre: t.nombre })),
];

export default function FeedReels({ inicial }: { inicial?: string }) {
  const params = useSearchParams();
  const t = params.get("tecnica");
  const tecnicaInicial: Tecnica | "todos" =
    t === "live-action" || t === "animacion" ? t : "todos";
  const [tecnica, setTecnica] = useState<Tecnica | "todos">(tecnicaInicial);

  const filtrar = (t: Tecnica | "todos") =>
    t === "todos" ? TODOS : TODOS.filter((p) => (p.tecnica ?? "live-action") === t);

  const lista = useMemo(() => filtrar(tecnica), [tecnica]);

  /* A dónde regresa el botón de salir. Quien abrió el reel manda la
     ruta de la cuadrícula con el filtro que tenía puesto; si nadie la
     manda, se vuelve al listado de trabajo.

     Si aquí dentro se cambia de técnica, el regreso cambia con ella:
     quien entró por Live action y se pasó a Animación quiere salir a
     la cuadrícula de animación, que es lo que acaba de estar viendo,
     no a la que traía al entrar. El filtro es uno solo, esté de un
     lado o del otro. */
  const regresoBase = params.get("volver") ?? "/trabajo";
  const regreso = useMemo(() => {
    try {
      const u = new URL(regresoBase, "http://local");
      if (u.pathname === "/trabajo" && u.searchParams.get("seccion") === "reels") {
        if (tecnica === "todos") u.searchParams.delete("sub");
        else u.searchParams.set("sub", tecnica);
        return u.pathname + u.search;
      }
    } catch {
      /* Una ruta que no se puede leer se devuelve tal cual */
    }
    return regresoBase;
  }, [regresoBase, tecnica]);

  const contenedor = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLDivElement | null)[]>([]);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  /* El índice de arranque se busca dentro de la lista ya filtrada: si
     se entra a un animado con el filtro de animación puesto, su
     posición no es la que ocupa en el catálogo completo. */
  const [activo, setActivo] = useState(() => {
    const i = filtrar(tecnicaInicial).findIndex((p) => p.slug === inicial);
    return i >= 0 ? i : 0;
  });
  /* El feed arranca con sonido. Son piezas hechas para redes, con
     diseño sonoro y música: mudas se juzgan a la mitad. El navegador
     puede negarse —casi todos bloquean el autoplay con audio si no
     hubo un gesto antes—, y para eso está la reserva de más abajo:
     si la reproducción se rechaza se silencia, se reintenta y el
     botón se pone en "Silencio", que es la verdad. */
  const [sonido, setSonido] = useState(true);
  /* Videos que no cargaron: se sustituyen por el aviso */
  const [fallidos, setFallidos] = useState<Record<string, boolean>>({});
  /* Hasta que el video activo pueda reproducirse, ninguno de sus
     vecinos pide un solo byte. Antes los tres montados atacaban la red
     a la vez y el primero tardaba de más en arrancar. */
  const [activoListo, setActivoListo] = useState(false);

  /* Posiciona el feed en la pieza pedida cuando se entra en frío */
  useEffect(() => {
    if (!inicial) return;
    const i = lista.findIndex((p) => p.slug === inicial);
    if (i > 0) slides.current[i]?.scrollIntoView({ behavior: "instant" as ScrollBehavior });
    // Solo al entrar: después manda el scroll del visitante.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inicial]);

  /* Detecta la pieza visible. Se vuelve a armar cuando cambia la
     lista: los nodos observados son otros. */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            setActivo(Number((e.target as HTMLElement).dataset.indice));
          }
        });
      },
      { threshold: [0.6], root: contenedor.current }
    );
    slides.current.forEach((s) => s && obs.observe(s));
    return () => obs.disconnect();
  }, [lista]);

  /* Reproduce el activo, pausa el resto */
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === activo) {
        v.muted = !sonido;
        v.play().catch(() => {
          /* Bloqueado por la política de autoplay: vale más el video
             mudo que un cuadro congelado. */
          if (!v.muted) {
            v.muted = true;
            setSonido(false);
            v.play().catch(() => {});
          }
        });
      } else {
        v.pause();
      }
    });
    /* La URL sigue a la pieza visible, para que sea compartible. Se
       conserva a dónde hay que volver y el filtro puesto: si se
       pierden, recargar deja el reproductor sin salida y sin el
       recorte que se estaba viendo. */
    const p = lista[activo];
    if (p) {
      const q = new URLSearchParams();
      q.set("volver", regresoBase);
      if (tecnica !== "todos") q.set("tecnica", tecnica);
      window.history.replaceState(null, "", `/reels/${p.slug}?${q}`);
    }
    setActivoListo(false);
  }, [activo, sonido, lista, regresoBase, tecnica]);

  /* Cambiar de técnica rearma el feed desde arriba: los índices que
     quedaban apuntaban a otras piezas. */
  const elegirTecnica = (t: Tecnica | "todos") => {
    if (t === tecnica) return;
    slides.current = [];
    videos.current = [];
    setTecnica(t);
    setActivo(0);
    contenedor.current?.scrollTo({ top: 0 });
  };

  /* Teclado */
  const mover = useCallback(
    (d: number) => {
      const i = Math.min(Math.max(activo + d, 0), lista.length - 1);
      slides.current[i]?.scrollIntoView({ behavior: "smooth" });
    },
    [activo, lista.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); mover(1); }
      if (e.key === "ArrowUp") { e.preventDefault(); mover(-1); }
      if (e.key === "m") setSonido((s) => !s);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mover]);

  const pieza = lista[activo];

  return (
    <div className="fixed inset-0 bg-black">
      <div
        ref={contenedor}
        className="feed sin-barra h-full w-full overflow-y-scroll"
      >
        {lista.map((p, i) => {
          const montado = Math.abs(i - activo) <= 1; // solo 3 reproductores
          return (
            <div
              key={p.slug}
              data-indice={i}
              ref={(el) => { slides.current[i] = el; }}
              className="relative h-[100dvh] w-full flex items-center justify-center"
            >
              <div className="relative h-full" style={{ aspectRatio: "9 / 16" }}>
                {/* La portada sostiene el encuadre mientras el video
                    carga. Es la misma imagen que lleva el <video> de
                    poster, así que no hay salto al arrancar. */}
                {p.tarjeta && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urlMedia(p.tarjeta)}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}

                {montado && p.media.tipo === "local" && !fallidos[p.slug] && (
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
                    onError={() => setFallidos((f) => ({ ...f, [p.slug]: true }))}
                    className="relative h-full w-full object-cover"
                  />
                )}

                {fallidos[p.slug] && (
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-8 text-center">
                    <p className="text-sm text-[color-mix(in_srgb,#eeebe3_70%,transparent)]">
                      Este video no se pudo cargar. Vuelve a intentarlo en un
                      momento.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── UNA sola capa de interfaz, fija ── */}
      <Interfaz
        pieza={pieza}
        regreso={regreso}
        indice={activo}
        total={lista.length}
        sonido={sonido}
        tecnica={tecnica}
        onTecnica={elegirTecnica}
        onSonido={() => setSonido((s) => !s)}
      />
    </div>
  );
}

function Interfaz({
  pieza, regreso, indice, total, sonido, tecnica, onTecnica, onSonido,
}: {
  pieza?: Pieza; regreso: string; indice: number; total: number;
  sonido: boolean; tecnica: Tecnica | "todos";
  onTecnica: (t: Tecnica | "todos") => void;
  onSonido: () => void;
}) {
  return (
    <>
      {/* Superior */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-4 md:p-6">
        <Link
          href={regreso}
          className="pointer-events-auto rounded-full bg-[color-mix(in_srgb,#111827_70%,transparent)] px-4 py-2 text-sm text-[var(--color-crema)] backdrop-blur-md hover:bg-[var(--color-crema)] hover:text-[var(--color-profundo)] transition-colors"
        >
          ← Volver
        </Link>

        {/* Grabado o animado, sin salir del feed */}
        <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,#111827_70%,transparent)] p-1 backdrop-blur-md">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              onClick={() => onTecnica(f.id)}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                tecnica === f.id
                  ? "bg-[var(--color-menta)] text-[var(--color-profundo)]"
                  : "text-[var(--color-crema)] hover:text-[var(--color-menta)]"
              }`}
            >
              {f.nombre}
            </button>
          ))}
          <button
            onClick={onSonido}
            className="ml-1 rounded-full px-3 py-1.5 text-xs text-[var(--color-crema)] transition-colors hover:text-[var(--color-menta)]"
            title="Tecla M"
          >
            {sonido ? "Sonido" : "Silencio"}
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
      {pieza && (
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
            {/* Quién lo hizo.

                Los casos lo enseñan en su propia sección al cierre,
                pero un reel no tiene caso: vive aquí y en ningún otro
                lado. Los créditos estaban escritos en la ficha desde
                hace rato sin que nadie pudiera verlos. Van en una
                línea, chicos y tenues, porque el protagonista es el
                video; pero van, que para eso se acreditan. */}
            {pieza.colaboradores && pieza.colaboradores.length > 0 && (
              <p className="mt-3 text-[11px] text-[color-mix(in_srgb,#eeebe3_55%,transparent)]">
                {pieza.colaboradores
                  .map((c) => `${c.rol}: ${c.nombre}`)
                  .join("  ·  ")}
              </p>
            )}
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
          </div>
        </div>
      )}
    </>
  );
}
