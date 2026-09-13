import { Suspense } from "react";
import FeedReels from "@/components/FeedReels";
import { reels } from "@/lib/content";

export function generateStaticParams() {
  return reels().map((p) => ({ slug: p.slug }));
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
