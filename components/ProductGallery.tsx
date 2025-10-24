// components/ProductGallery.tsx
"use client";
export default function ProductGallery({ images }: { images: string[] }) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-3 snap-x snap-mandatory">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`galerie ${i+1}`}
            className="h-72 w-auto rounded-xl border snap-center"
          />
        ))}
      </div>
    </div>
  );
}
