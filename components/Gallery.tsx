// components/Gallery.tsx
// o galerie simplă, aerisită, pentru poze cu copii și cărțile primite

export default function Gallery() {
  const imgs = [
    "/gallery/g1.jpg",
    "/gallery/g2.jpg",
    "/gallery/g3.jpg",
    "/gallery/g4.jpg",
    "/gallery/g5.jpg",
    "/gallery/g6.jpg",
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12">
      <h2 className="text-2xl font-bold mb-6">Poze de la voi</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {imgs.map((src, i) => (
          <div key={i} className="rounded-xl overflow-hidden border">
            <img
              src={src}
              alt={`Poză client ${i + 1}`}
              className="w-full h-48 object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
