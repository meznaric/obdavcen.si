import { useId, useState, type CSSProperties, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { ArrowDown01Icon, ArrowLeft01Icon } from "hugeicons-react";
import { AnimatePresence, motion } from "motion/react";

export type TreeColor =
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "orange"
  | "purple"
  | "pink"
  | "indigo"
  | "gray";

export interface TreeItem {
  label: string;
  value?: string | number | ReactNode;
  subValue?: string | number | ReactNode;
  description?: string | React.ReactNode;
  icon?: ReactNode;
  color?: TreeColor;
  tooltip?: string;
  // Vrstica brez zneska (npr. neuporabljen davčni razred) je zatemnjena
  muted?: boolean;
  children?: TreeItem[];
}

interface TreeBreakdownProps {
  items: TreeItem[];
  className?: string;
}

/*
  Barve vsake ravni so v spremenljivkah CSS, da veljajo za svetli in temni
  način na enem mestu:
    --tree-row   ozadje vrstice
    --tree-rail  ozadje gnezdenih ravni (zamik na levi) in opisov
    --tree-text  barva besedila
  Vrstice, zamiki in opisi se na levi prelijejo iz prosojnega v svojo barvo
  na dolžini --tree-indent, zato se vsaka raven enako zlije v nadrejeno, ne
  glede na barvo in širino vrstice.
*/
const palette: Record<TreeColor, string> = {
  red: "[--tree-row:var(--color-red-100)] [--tree-rail:var(--color-red-200)] [--tree-text:var(--color-red-950)] dark:[--tree-row:var(--color-red-800)] dark:[--tree-rail:var(--color-red-700)] dark:[--tree-text:var(--color-red-50)]",
  blue: "[--tree-row:var(--color-blue-100)] [--tree-rail:var(--color-blue-200)] [--tree-text:var(--color-blue-950)] dark:[--tree-row:var(--color-blue-800)] dark:[--tree-rail:var(--color-blue-700)] dark:[--tree-text:var(--color-blue-50)]",
  green:
    "[--tree-row:var(--color-green-100)] [--tree-rail:var(--color-green-200)] [--tree-text:var(--color-green-950)] dark:[--tree-row:var(--color-green-800)] dark:[--tree-rail:var(--color-green-700)] dark:[--tree-text:var(--color-green-50)]",
  // Rumena je rezervirana za opozorila
  yellow:
    "[--tree-row:var(--color-amber-100)] [--tree-rail:var(--color-amber-200)] [--tree-text:var(--color-amber-950)] dark:[--tree-row:var(--color-amber-800)] dark:[--tree-rail:var(--color-amber-700)] dark:[--tree-text:var(--color-amber-50)]",
  orange:
    "[--tree-row:var(--color-orange-100)] [--tree-rail:var(--color-orange-200)] [--tree-text:var(--color-orange-950)] dark:[--tree-row:var(--color-orange-800)] dark:[--tree-rail:var(--color-orange-700)] dark:[--tree-text:var(--color-orange-50)]",
  purple:
    "[--tree-row:var(--color-purple-100)] [--tree-rail:var(--color-purple-200)] [--tree-text:var(--color-purple-950)] dark:[--tree-row:var(--color-purple-800)] dark:[--tree-rail:var(--color-purple-700)] dark:[--tree-text:var(--color-purple-50)]",
  pink: "[--tree-row:var(--color-pink-100)] [--tree-rail:var(--color-pink-200)] [--tree-text:var(--color-pink-950)] dark:[--tree-row:var(--color-pink-800)] dark:[--tree-rail:var(--color-pink-700)] dark:[--tree-text:var(--color-pink-50)]",
  indigo:
    "[--tree-row:var(--color-indigo-100)] [--tree-rail:var(--color-indigo-200)] [--tree-text:var(--color-indigo-950)] dark:[--tree-row:var(--color-indigo-800)] dark:[--tree-rail:var(--color-indigo-700)] dark:[--tree-text:var(--color-indigo-50)]",
  gray: "[--tree-row:var(--color-gray-100)] [--tree-rail:var(--color-gray-200)] [--tree-text:var(--color-gray-900)] dark:[--tree-row:var(--color-gray-800)] dark:[--tree-rail:var(--color-gray-700)] dark:[--tree-text:var(--color-gray-100)]",
};

// Prelivanje iz nadrejene ravni (ki se vidi skozi prosojni del) v svojo barvo
function fade(variable: "--tree-row" | "--tree-rail"): CSSProperties {
  return {
    backgroundImage: `linear-gradient(to right, transparent, var(${variable}) var(--tree-indent))`,
  };
}

const rowClassName =
  "flex w-full items-center gap-2 p-2 text-left text-(--tree-text) border-b-2 border-(--tree-rail)";

function RowContent({
  item,
  hasChildren,
  isExpanded,
}: {
  item: TreeItem;
  hasChildren: boolean;
  isExpanded: boolean;
}) {
  return (
    <>
      {item.icon && (
        <span className="shrink-0" aria-hidden="true">
          {item.icon}
        </span>
      )}
      <span className="min-w-0 grow break-words">
        <span className="block">{item.label}</span>
        {item.tooltip && (
          <span className="block text-sm font-medium opacity-90">
            {item.tooltip}
          </span>
        )}
      </span>
      {(item.value !== undefined || item.subValue !== undefined) && (
        <span className="shrink-0 text-right">
          {item.value !== undefined && (
            <span className="block text-sm font-medium tabular-nums">
              {item.value}
            </span>
          )}
          {item.subValue !== undefined && (
            <span className="block text-sm tabular-nums opacity-90">
              {item.subValue}
            </span>
          )}
        </span>
      )}
      {hasChildren &&
        (isExpanded ? (
          <ArrowDown01Icon className="size-4 shrink-0" aria-hidden="true" />
        ) : (
          <ArrowLeft01Icon className="size-4 shrink-0" aria-hidden="true" />
        ))}
    </>
  );
}

function TreeNode({ item, level = 0 }: { item: TreeItem; level?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const childrenId = useId();
  const hasChildren = !!item.children && item.children.length > 0;
  const color = item.color ?? "gray";

  return (
    <div
      className={twMerge("w-full", palette[color])}
      // Najvišja raven ima polno ozadje, da drevo ni odvisno od podlage
      style={level === 0 ? { backgroundColor: "var(--tree-rail)" } : undefined}
    >
      {hasChildren ? (
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={childrenId}
          onClick={() => setIsExpanded(!isExpanded)}
          className={twMerge(
            rowClassName,
            "cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-current",
            item.muted && "opacity-75"
          )}
          style={fade("--tree-row")}
        >
          <RowContent item={item} hasChildren isExpanded={isExpanded} />
        </button>
      ) : (
        <div
          className={twMerge(rowClassName, item.muted && "opacity-75")}
          style={fade("--tree-row")}
        >
          <RowContent item={item} hasChildren={false} isExpanded={false} />
        </div>
      )}
      <AnimatePresence initial={false} mode="sync">
        {item.description && (isExpanded || !hasChildren) && (
          <motion.div
            transition={{ duration: 0.2 }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            key="description"
            className="overflow-hidden"
          >
            {typeof item.description === "string" ? (
              <p
                className="p-4 text-sm text-(--tree-text)"
                style={fade("--tree-rail")}
              >
                {item.description}
              </p>
            ) : (
              <div className="text-(--tree-text)" style={fade("--tree-rail")}>
                {item.description}
              </div>
            )}
          </motion.div>
        )}
        {hasChildren && isExpanded && (
          <motion.div
            id={childrenId}
            key="children"
            transition={{ duration: 0.2 }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-(--tree-indent)"
            style={fade("--tree-rail")}
          >
            {item.children?.map((child, index) => (
              <TreeNode key={index} item={child} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TreeBreakdown({ items, className }: TreeBreakdownProps) {
  return (
    <div
      className={twMerge(
        "overflow-hidden rounded-md [--tree-indent:0.75rem] sm:[--tree-indent:1rem]",
        className
      )}
    >
      {items.map((item, index) => (
        <TreeNode key={index} item={item} />
      ))}
    </div>
  );
}
