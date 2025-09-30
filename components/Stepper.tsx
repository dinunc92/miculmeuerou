export default function Stepper({step,total}:{step:number; total:number}) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({length: total}).map((_,i)=>(
        <div key={i} className={`h-2 flex-1 rounded-full ${i<step? "bg-brand-turquoise":"bg-gray-200"}`}/>
      ))}
    </div>
  );
}
