import Link from "next/link";
import { SITIO } from "@/lib/sitio";

export const metadata = { title: "Gracias" };

/* A dónde cae el formulario de contacto después de enviarse.

   Netlify tiene una página de confirmación propia, pero es suya: sale
   del sitio, con otra tipografía y otro fondo. Después de escribirle
   a un estudio de diseño, terminar en una pantalla genérica es un mal
   último paso. Esta página no hace nada más que confirmar y devolver
   al trabajo. */
export default function Gracias() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[1100px] flex-col justify-center px-6 lg:px-10 py-20">
      <h1 className="display text-4xl md:text-6xl text-[var(--color-crema)] max-w-[16ch]">
        Recibido. Gracias.
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-[color-mix(in_srgb,#eeebe3_75%,transparent)]">
        Ya llegó tu mensaje. Te respondemos por donde nos dejaste contacto,
        normalmente el mismo día. Si te urge, escríbenos directo a{" "}
        <a
          href={`mailto:${SITIO.correo}`}
          className="text-[var(--color-menta)] hover:underline"
        >
          {SITIO.correo}
        </a>
        .
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Link
          href="/trabajo"
          className="rounded-full bg-[var(--color-menta)] px-6 py-3 text-sm font-medium text-[var(--color-profundo)] transition-colors hover:bg-[var(--color-crema)]"
        >
          Seguir viendo el trabajo
        </Link>
        <Link
          href="/"
          className="rounded-full border border-[var(--color-borde)] px-6 py-3 text-sm text-[var(--color-crema)] transition-colors hover:border-[var(--color-crema)]"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
