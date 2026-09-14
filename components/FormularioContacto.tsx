"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* El formulario de contacto.

   Lo recibe Netlify Forms, que se eligió por lo que no pide: ningún
   servidor que mantener, ninguna clave de API en el repositorio y
   ningún crédito de cómputo —los envíos van por un canal aparte del
   de los despliegues—. El plan gratuito da cien envíos al mes, de
   sobra para una página de contacto.

   Hay un rodeo que explicar. Netlify descubre los formularios leyendo
   el HTML publicado al compilar, y Next.js no publica sus páginas
   como HTML suelto: las sirve su propio runtime. Por eso la
   definición del formulario vive en public/__forms.html —un archivo
   estático que nadie visita— y este envía ahí. Es la solución que
   documenta Netlify para este framework.

   El envío se intercepta para poder llevar a /gracias en vez de a la
   pantalla de confirmación genérica de Netlify. Si el navegador no
   ejecuta JavaScript, el `action` del formulario hace lo mismo por su
   cuenta y la confirmación es la de Netlify: menos bonita, pero el
   mensaje llega igual.

   En localhost NO funciona: no hay nada escuchando. Se prueba en el
   sitio desplegado, y los despliegues de rama registran envíos igual
   que producción. Los avisos por correo se activan una sola vez en el
   panel, en Forms → Form notifications.

   Si se agrega o se renombra un campo aquí, hay que reflejarlo en
   public/__forms.html o ese dato no llega al buzón. */

const DESTINO = "/__forms.html";

const TIPOS = [
  "Contenido vertical",
  "Audiovisual comercial",
  "Identidad de marca",
  "Fotografía",
  "Todavía no sé",
];

const PRESUPUESTOS = [
  "Menos de $5,000",
  "$5,000 – $15,000",
  "$15,000 – $35,000",
  "Más de $35,000",
  "Prefiero platicarlo",
];

const ETIQUETA =
  "text-[11px] uppercase tracking-[0.18em] text-[var(--color-texto-tenue)]";
const CAMPO =
  "mt-2 w-full rounded-lg border border-[var(--color-borde)] bg-[var(--color-superficie)] px-4 py-3 text-sm text-[var(--color-crema)] outline-none focus:border-[var(--color-menta)] transition-colors";

export default function FormularioContacto() {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(false);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    setError(false);
    const datos = new FormData(e.currentTarget);
    try {
      const r = await fetch(DESTINO, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(datos as unknown as Record<string, string>).toString(),
      });
      if (!r.ok) throw new Error(String(r.status));
      router.push("/gracias");
    } catch {
      setEnviando(false);
      setError(true);
    }
  }

  return (
    <form
      name="contacto"
      method="POST"
      action={DESTINO}
      data-netlify="true"
      data-netlify-honeypot="empresa-web"
      onSubmit={enviar}
      className="grid gap-5 md:grid-cols-2"
    >
      <input type="hidden" name="form-name" value="contacto" />
      {/* Trampa para robots: invisible para quien usa la página, y si
          llega llena, Netlify descarta el envío. */}
      <p className="hidden">
        <label>
          No llenar este campo: <input name="empresa-web" tabIndex={-1} />
        </label>
      </p>

      <label className="block">
        <span className={ETIQUETA}>Nombre</span>
        <input type="text" name="nombre" required className={CAMPO} />
      </label>

      <label className="block">
        <span className={ETIQUETA}>Marca o negocio</span>
        <input type="text" name="marca" className={CAMPO} />
      </label>

      {/* Sin una forma de responder, lo demás no sirve de nada. */}
      <label className="block">
        <span className={ETIQUETA}>Correo o teléfono</span>
        <input type="text" name="contacto" required className={CAMPO} />
      </label>

      <label className="block">
        <span className={ETIQUETA}>Tipo de proyecto</span>
        <select name="tipo" className={CAMPO} defaultValue={TIPOS[0]}>
          {TIPOS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>

      <label className="block md:col-span-2">
        <span className={ETIQUETA}>Presupuesto aproximado</span>
        <select name="presupuesto" className={CAMPO} defaultValue={PRESUPUESTOS[0]}>
          {PRESUPUESTOS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>

      {/* El campo abierto. Los cinco de arriba sirven para clasificar;
          este es donde de verdad se cuenta el proyecto, y por eso no
          es obligatorio: quien todavía no sabe qué necesita no debería
          quedarse atorado aquí. */}
      <label className="block md:col-span-2">
        <span className={ETIQUETA}>Cuéntanos (opcional)</span>
        <textarea
          name="mensaje"
          rows={5}
          placeholder="Qué traes en mente, para cuándo lo necesitas, qué has hecho antes…"
          className={`${CAMPO} resize-y placeholder:text-[color-mix(in_srgb,#eeebe3_35%,transparent)]`}
        />
      </label>

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={enviando}
          className="rounded-full bg-[var(--color-menta)] px-7 py-3 text-sm font-medium text-[var(--color-profundo)] transition-colors hover:bg-[var(--color-crema)] disabled:opacity-60"
        >
          {enviando ? "Enviando…" : "Enviar"}
        </button>
        {error ? (
          <p className="mt-3 text-xs text-[var(--color-naranja)]">
            No se pudo enviar. Vuelve a intentarlo o escríbenos directo por
            correo.
          </p>
        ) : (
          <p className="mt-3 text-xs text-[var(--color-texto-tenue)]">
            Respondemos al correo o al teléfono que dejes, normalmente el mismo
            día.
          </p>
        )}
      </div>
    </form>
  );
}
