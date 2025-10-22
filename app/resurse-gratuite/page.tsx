export default function ResursePage(){
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-4">Resurse gratuite</h1>
      <p className="text-gray-700 mb-6">
        Descoperă materiale educative gratuite pentru copii între 3 și 6 ani:
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li>Fișe PDF gratuite pentru recunoașterea animalelor</li>
        <li>O poveste audio – „Ziua mea magică”</li>
        <li>Ghid pentru părinți: cum să alegi cartea potrivită vârstei</li>
      </ul>
      <div className="mt-6">
        <a href="/downloads/fise-demo.pdf" className="btn-cta">Descarcă fișele demo</a>
      </div>
    </div>
  );
}
