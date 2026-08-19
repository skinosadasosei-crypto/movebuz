"use client";

import { useState } from "react";
import Image from "next/image";

export default function ArticleThumbnail({ slug, title }: { slug: string; title: string }) {
  const [error, setError] = useState(false);

  if (error) return null;

  return (
    <div className="mb-8 rounded-2xl overflow-hidden border border-border">
      <div className="aspect-[16/9] relative">
        <Image
          src={`/images/thumbnails/${slug}.svg`}
          alt={title}
          fill
          className="object-cover"
          priority
          onError={() => setError(true)}
        />
      </div>
    </div>
  );
}
