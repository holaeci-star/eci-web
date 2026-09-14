import type { Metadata } from "next";
import { Suspense } from "react";
import FeedReels from "@/components/FeedReels";
import { piezaPorSlug, reels } from "@/lib/content";
import { urlMedia } from "@/lib/media";

export function generateStaticParams() {
  return reels().map((p) => ({ slug: p.slug }));
}

/* Igual que los casos: compartir un reel enseña ese reel. La portada
   es vertical y las redes la recortan, pero vale más el fotograma del
   trabajo que una tarjeta genérica repetida diecisiete veces. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = piezaPorSlug(slug);
  if (!p) return {};

  const titulo = `${p.titulo} — ${p.cliente}`;
  return {
    title: p.titulo,
    description: p.resumen,
    openGraph: {
      title: titulo,
      description: p.resumen,
      images: p.tarjeta ? [{ url: urlMedia(p.tarjeta), alt: titulo }] : undefined,
    },
  };
}

export default async function ReelPorSlug({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <Suspense>
      <FeedReels inicial={slug} />
    </Suspense>
  );
}
