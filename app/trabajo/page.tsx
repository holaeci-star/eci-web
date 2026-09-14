import { Suspense } from "react";
import Rejilla from "@/components/Rejilla";

export const metadata = {
  title: "Trabajo",
  description:
    "Identidad de marca, contenido vertical y fotografía para negocios reales. Una selección de proyectos de ECI.",
};

export default function Trabajo() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 lg:px-10 py-14 md:py-20">
      <h1 className="display text-4xl md:text-6xl text-[var(--color-crema)]">Trabajo</h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-[color-mix(in_srgb,#eeebe3_75%,transparent)]">
        Cada trabajo es un reto, un aprendizaje y una oportunidad. Una
        oportunidad de conectar y dejar algo de nosotros con las personas, las
        marcas y los proyectos con los que trabajamos. Esta es una selección de
        algunos de esos proyectos desde la parte audiovisual, dar vida a una
        marca o documentar parte de su proceso.
      </p>
      <div className="mt-10">
        <Suspense>
          <Rejilla />
        </Suspense>
      </div>
    </section>
  );
}
