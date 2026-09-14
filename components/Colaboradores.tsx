import type { Colaborador } from "@/lib/content";

/* Créditos de la pieza.

   Va al cierre del caso, antes de las otras piezas del cliente. Es la
   parte que le sirve al equipo: quien colaboró queda acreditado con su
   nombre, su rol y, si quiere, un enlace a sus redes.

   Encaja con el propósito declarado de ECI —que los creativos que
   empiezan ganen experiencia y portafolio—, así que no es un adorno:
   es la prueba pública de ese trato. */

/* Deduce la red desde el dominio, para no tener que escribirla a mano */
function nombreDeRed(url?: string, explicito?: string): string | null {
  if (explicito) return explicito;
  if (!url) return null;
  try {
    const h = new URL(url).hostname.replace(/^www\./, "");
    if (h.includes("instagram")) return "Instagram";
    if (h.includes("behance")) return "Behance";
    if (h.includes("linkedin")) return "LinkedIn";
    if (h.includes("vimeo")) return "Vimeo";
    if (h.includes("youtube") || h.includes("youtu.be")) return "YouTube";
    if (h.includes("tiktok")) return "TikTok";
    if (h.includes("x.com") || h.includes("twitter")) return "X";
    if (h.includes("dribbble")) return "Dribbble";
    return h;
  } catch {
    return null;
  }
}

export default function Colaboradores({ lista }: { lista: Colaborador[] }) {
  if (!lista.length) return null;

  return (
    <section className="mt-16 border-t border-[var(--color-borde)] pt-10">
      <h2 className="text-xs uppercase tracking-[0.2em] text-[var(--color-texto-tenue)]">
        Colaboradores
      </h2>

      <ul className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((c) => {
          const red = nombreDeRed(c.url, c.red);
          return (
            <li key={c.nombre + c.rol} className="min-w-0">
              <p className="display-suave text-[15px] leading-tight text-[var(--color-crema)]">
                {c.nombre}
              </p>
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-[var(--color-texto-tenue)]">
                {c.rol}
              </p>
              {c.url && red && (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-xs text-[var(--color-menta)] transition-colors hover:text-[var(--color-crema)]"
                >
                  {red}
                  <span aria-hidden className="text-[10px]">↗</span>
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
