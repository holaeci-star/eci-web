import { Suspense } from "react";
import Rejilla from "@/components/Rejilla";

export const metadata = { title: "Trabajo" };

export default function Trabajo() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 lg:px-10 py-14 md:py-20">
      <h1 className="display text-4xl md:text-6xl text-[var(--color-crema)]">Trabajo</h1>
      <p className="mt-4 max-w-xl text-sm md:text-base text-[var(--color-texto-tenue)] leading-relaxed">
        Cada pieza conserva su proporción nativa. Las etiquetas muestran las
        medidas de la portada según el manual de recursos, para poder juzgar
        los tamaños antes de exportar el material real.
      </p>
      <div className="mt-10">
        <Suspense>
          <Rejilla />
        </Suspense>
      </div>
    </section>
  );
}
