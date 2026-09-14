import { redirect } from "next/navigation";
import { reels } from "@/lib/content";

/* Entrar a Reels es entrar al reproductor.

   Había una pantalla intermedia con el catálogo en cuadrícula: se
   elegía un reel y de ahí se pasaba al feed. Dos pasos para ver un
   video de quince segundos, y una cuadrícula de miniaturas mudas que
   compite mal con el formato al que el visitante ya está acostumbrado.
   Ahora la categoría abre directo en el primero y desde ahí se
   desliza; el filtro de grabado o animado se quedó dentro del feed.

   La ruta sobrevive —el menú, la portada y cualquier enlace viejo
   siguen apuntando aquí— y redirige del lado del servidor, así que no
   hay parpadeo: el navegador nunca llega a pintar esta página. */
export default function Reels() {
  const primero = reels()[0];
  redirect(primero ? `/reels/${primero.slug}?volver=/trabajo` : "/trabajo");
}
