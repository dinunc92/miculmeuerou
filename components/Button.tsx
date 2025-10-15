import { clsx } from "clsx";

export default function Button({ className, children, ...props }: any){
  return (
    <button
      {...props}
      className={clsx(
        "rounded-2xl px-6 py-3 font-semibold shadow-soft transition transform",
        "bg-gradient-to-r from-brand-lilac to-brand-turquoise text-white",
        "hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
        className
      )}>
      {children}
    </button>
  );
}
