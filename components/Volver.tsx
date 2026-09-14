"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

/* El enlace de regreso de un caso.

   Volver al listado no es volver a "/trabajo" a secas: si alguien
   estaba viendo Marca › Exprés y entra a un proyecto, salir tiene que
   devolverlo ahí y no al catálogo completo, donde perdió el sitio en
   el que iba. La rejilla manda esa ruta en `?volver=` al abrir la
   tarjeta; aquí solo se lee.

   Sin el parámetro —entrando por un enlace compartido, por ejemplo—
   se va al listado, que es el menú desde donde se puede elegir. */
export default function Volver() {
  const destino = useSearchParams().get("volver") ?? "/trabajo";
  return (
    <Link
      href={destino}
      className="text-sm text-[var(--color-texto-tenue)] transition-colors hover:text-[var(--color-menta)]"
    >
      ← Trabajo
    </Link>
  );
}
