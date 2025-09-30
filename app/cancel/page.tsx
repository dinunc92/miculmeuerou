export default function Success(){ return <div className="mx-auto max-w-3xl p-10 text-center">
  <h1 className="text-3xl font-bold">Plată efectuată ✅</h1>
  <p className="mt-2 text-gray-600">Ți-am trimis un email cu detalii. Mulțumim!</p></div>; }

export default function Cancel(){ return <div className="mx-auto max-w-3xl p-10 text-center">
  <h1 className="text-3xl font-bold">Plată anulată</h1>
  <p className="mt-2 text-gray-600">Poți încerca din nou oricând.</p></div>; }
