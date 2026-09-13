import RejillaReels from "@/components/RejillaReels";

export const metadata = {
  title: "Reels",
  description:
    "Contenido vertical para redes: piezas grabadas y de animación, de campaña y de marca.",
};

/* Entrar a Reels ya no cae directo en el feed a pantalla completa.
   Primero se ve el catálogo completo y desde ahí se elige por dónde
   empezar; el feed vive en /reels/<slug>. */
export default function Reels() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 lg:px-10 py-14 md:py-20">
      <h1 className="display text-4xl md:text-6xl text-[var(--color-crema)]">
        Reels
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-[color-mix(in_srgb,#eeebe3_72%,transparent)]">
        Contenido vertical para redes. Elige uno para verlo a pantalla completa
        y seguir el feed desde ahí.
      </p>

      <div className="mt-10">
        <RejillaReels />
      </div>
    </section>
  );
}
