/* ───────────────────────────────────────────────────────────────
   DE DÓNDE SALEN LOS ARCHIVOS PESADOS

   El planteamiento lo dice desde el documento maestro: el CMS —o en
   este caso la ficha— guarda un identificador, no una URL completa.
   Así se puede cambiar de proveedor sin tocar el contenido.

   Aquí se resuelve ese identificador a una URL real:

   - Si la ruta ya es absoluta (empieza con http), se respeta.
   - Si no, se le antepone NEXT_PUBLIC_MEDIA_BASE.
   - Sin esa variable, queda relativa y se sirve desde public/.

   En la práctica:

     desarrollo   sin variable      →  /demo/reels/reel-01.mp4
     producción   media.eci.mx      →  https://media.eci.mx/demo/reels/reel-01.mp4

   Cambiar de Netlify a Cloudflare R2, o a cualquier otro almacenamiento,
   es cuestión de mover esa variable de entorno. Ni una línea de código.

   REGLA PRÁCTICA de qué va en cada lado:

     En el repositorio   portadas, galerías, previews de hover, logos y
                         tipografías — todo lo que pese menos de ~1 MB.
     Fuera               los reels completos y el video del hero, que son
                         los que engordan el historial de Git y se comen
                         el ancho de banda.
   ─────────────────────────────────────────────────────────────── */

const BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE ?? "").replace(/\/$/, "");

/* QUÉ VIVE FUERA Y QUÉ VIVE EN EL REPOSITORIO

   Solo los archivos pesados se sirven desde el almacenamiento externo.
   Las imágenes —portadas, tarjetas y galerías— pesan pocos cientos de
   KB y se versionan junto al código, así que se sirven desde el propio
   sitio y NO deben llevar el prefijo.

   La regla es el primer segmento de la ruta: lo que empiece con alguno
   de estos prefijos va a R2; todo lo demás se queda local. */
const REMOTOS = ["/01_REELS/", "/02_ANIMACIONES/", "/hero/"];

const esRemoto = (src: string) => REMOTOS.some((p) => src.startsWith(p));

/* Los nombres de archivo reales traen espacios y ampersands —
   "2025-Desvelados_Thai Latte.mp4", "..._R&G.Tak.mp4"— que en una URL
   hay que codificar o el navegador corta la ruta. Se codifica segmento
   por segmento para no tocar las diagonales. */
const codificar = (ruta: string) =>
  ruta.split("/").map((s) => encodeURIComponent(s)).join("/");

export function urlMedia(src: string): string {
  if (!src) return src;
  if (/^https?:\/\//i.test(src)) return src;
  if (!BASE || !esRemoto(src)) return src;
  return `${BASE}/${codificar(src.slice(1))}`;
}
