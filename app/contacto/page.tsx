import FormularioContacto from "@/components/FormularioContacto";
import { SITIO } from "@/lib/sitio";

export const metadata = {
  title: "Contacto",
  description:
    "Cuéntanos cómo te podemos apoyar. Cinco campos bastan para saber si podemos ayudarte y con qué paquete empezar.",
};

export default function Contacto() {
  return (
    <section className="mx-auto max-w-[1100px] px-6 lg:px-10 py-14 md:py-20">
      <h1 className="display text-4xl md:text-6xl text-[var(--color-crema)] max-w-[16ch] uppercase">
        Cuéntanos cómo te podemos apoyar
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-[color-mix(in_srgb,#eeebe3_75%,transparent)]">
        5 campos simples. Con esto basta para saber si podemos ayudarte y con
        qué paquete empezar.
      </p>

      <div className="mt-12 grid gap-12 md:grid-cols-[1.3fr_1fr]">
        <FormularioContacto />

        {/* Contacto directo, para quien prefiere no llenar nada */}
        <div className="space-y-4">
          <Tarjeta
            etiqueta="Correo"
            valor={SITIO.correo}
            href={`mailto:${SITIO.correo}`}
          />
          <Tarjeta
            etiqueta="Teléfono"
            valor={SITIO.telefono}
            href={`tel:${SITIO.telefonoE164}`}
          />
          <Tarjeta
            etiqueta="Instagram"
            valor={SITIO.instagram}
            href={SITIO.instagramUrl}
            externo
          />
          <Tarjeta
            etiqueta="Facebook"
            valor="ECI Estudio"
            href={SITIO.facebookUrl}
            externo
          />
          <p className="pt-2 text-xs text-[var(--color-texto-tenue)]">
            {SITIO.ciudad}
          </p>
        </div>
      </div>
    </section>
  );
}

function Tarjeta({
  etiqueta,
  valor,
  href,
  externo = false,
}: {
  etiqueta: string;
  valor: string;
  href: string;
  externo?: boolean;
}) {
  return (
    <a
      href={href}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="block rounded-xl border border-[var(--color-borde)] p-5 transition-colors hover:border-[var(--color-menta)]"
    >
      <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-menta)]">
        {etiqueta}
      </span>
      <p className="display-suave mt-1 text-lg text-[var(--color-crema)]">{valor}</p>
    </a>
  );
}
