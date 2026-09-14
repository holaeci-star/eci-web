"use client";

import { useEffect, useRef, useState } from "react";
import Grafico from "./Grafico";

/* La caja de un pilar de la portada, con las portadas reales
   alternándose solas.

   Antes eran tres recuadros grises con el nombre del servicio encima.
   El sitio es un portafolio: enseñar un marcador donde debería ir el
   trabajo es la forma más rápida de no convencer a nadie. Ahora cada
   pilar va pasando por las portadas de sus propios proyectos, cuatro
   segundos cada una, con un cruce suave.

   Tres decisiones que importan:

   1. NO SE MONTAN TODAS LAS IMÁGENES DE GOLPE. Se monta la que se ve
      y las que ya se vieron. Contenido Vertical tiene ocho portadas;
      pedirlas todas al abrir la portada costaría más que el hero.
      Así la primera carga es una imagen por pilar y el resto entra al
      ritmo del ciclo, cuando el visitante sigue ahí.

   2. FUERA DE PANTALLA NO PASA NADA. Los pilares están debajo del
      hero: si nadie ha bajado, el intervalo no corre ni se piden
      imágenes nuevas.

   3. QUIEN PIDIÓ MENOS MOVIMIENTO NO LO TIENE. Con
      prefers-reduced-motion la caja se queda en la primera portada,
      quieta. Es una animación decorativa y no debe pelearse con esa
      preferencia. */

const SEGUNDOS = 4;

export default function PilarRotativo({
  imagenes,
  proporcion,
  sizes,
  alt = "",
}: {
  imagenes: string[];
  proporcion: string;
  sizes: string;
  alt?: string;
}) {
  const [i, setI] = useState(0);
  /* Índices ya montados. Empieza con el primero y crece de uno en uno
     conforme avanza el ciclo. */
  const [montados, setMontados] = useState<number[]>([0]);
  const caja = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { rootMargin: "120px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (imagenes.length < 2 || !visible) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const t = setInterval(() => {
      setI((n) => {
        const sig = (n + 1) % imagenes.length;
        setMontados((m) => (m.includes(sig) ? m : [...m, sig]));
        return sig;
      });
    }, SEGUNDOS * 1000);
    return () => clearInterval(t);
  }, [imagenes.length, visible]);

  return (
    <div
      ref={caja}
      className="relative overflow-hidden rounded-xl border border-[var(--color-borde)] bg-[var(--color-superficie)]"
      style={{ aspectRatio: proporcion }}
    >
      {montados.map((n) => (
        <div
          key={n}
          className="absolute inset-0 transition-opacity duration-[900ms] ease-[var(--ease-eci)]"
          style={{ opacity: n === i ? 1 : 0 }}
        >
          <Grafico src={imagenes[n]} alt={n === 0 ? alt : ""} sizes={sizes} />
        </div>
      ))}

      {/* Un velo bajo para que el título que va debajo no compita con
          portadas claras, que las hay: los casos de marca llegan sobre
          crema y blanco. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,#111827_45%,transparent)] via-transparent to-transparent" />
    </div>
  );
}
