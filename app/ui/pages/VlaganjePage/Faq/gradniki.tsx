import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type VrsticaPrimera = {
  oznaka: ReactNode;
  vrednost: ReactNode;
  poudarek?: "davek" | "ostane" | "krepko";
};

/** Kratek primer z izračunom: vrstice "oznaka … vrednost". */
export function Primer({
  uvod,
  vrstice,
  opomba,
}: {
  uvod: ReactNode;
  vrstice: VrsticaPrimera[];
  opomba?: ReactNode;
}) {
  return (
    <div className="not-prose rounded-lg border border-base-300 bg-base-100 p-4 text-sm space-y-2">
      <p>{uvod}</p>
      <table className="w-full">
        <tbody>
          {vrstice.map((v, i) => (
            <tr key={i} className="border-b border-base-300 last:border-0">
              <td className="py-1 pr-4">{v.oznaka}</td>
              <td
                className={twMerge(
                  "py-1 text-right whitespace-nowrap tabular-nums",
                  v.poudarek === "davek" && "font-bold text-red-700 dark:text-red-400",
                  v.poudarek === "ostane" && "font-bold text-green-700 dark:text-green-400",
                  v.poudarek === "krepko" && "font-bold"
                )}
              >
                {v.vrednost}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {opomba && <p className="opacity-80">{opomba}</p>}
    </div>
  );
}

export function ZunanjaPovezava({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link">
      {children}
    </a>
  );
}
