import { redirect } from "next/navigation";

/* Reels no tiene pantalla propia: vive dentro de Trabajo.

   Tenía una, con su cuadrícula y su filtro, duplicando lo que la
   sección de Trabajo ya hacía; eran dos listas del mismo material que
   había que mantener iguales a mano. La ruta se queda —el menú, el
   pilar de la portada y cualquier enlace viejo siguen apuntando
   aquí— y redirige del lado del servidor, así que el navegador nunca
   llega a pintar esta página. */
export default function Reels() {
  redirect("/trabajo?seccion=reels");
}
