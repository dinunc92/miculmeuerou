import { clsx } from "clsx";
export default function Button({className, ...props}: any){
  return <button {...props} className={clsx("btn-cta bg-brand-turquoise text-white hover:brightness-110", className)} />;
}
