import { useState, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { ArrowDown01Icon, ArrowLeft01Icon } from "hugeicons-react";
import { Text } from "../Text/Text";
import { tv } from "tailwind-variants";
import { AnimatePresence, motion } from "framer-motion";

export interface TreeItem {
  label: string;
  value?: string | number | ReactNode;
  subValue?: string | number | ReactNode;
  description?: string | React.ReactNode;
  icon?: ReactNode;
  color?:
    | "red"
    | "blue"
    | "green"
    | "yellow"
    | "purple"
    | "pink"
    | "indigo"
    | "gray";
  tooltip?: string;
  children?: TreeItem[];
}

interface TreeBreakdownProps {
  items: TreeItem[];
  className?: string;
}

const variants = tv({
  slots: {
    main: "flex items-center p-2 gap-2 group relative focus:outline-none",
    sublist: "",
    description: "",
    containerLevel0: "",
  },
  variants: {
    color: {
      red: {
        main: "text-red-100  bg-gradient-to-r from-transparent to-red-800 to-5% border-b-2 border-red-700 focus:to-red-600",
        sublist: "bg-red-700 text-red-100 bg-red-700",
        description: "bg-red-700 text-red-100",
        containerLevel0: "bg-red-700",
      },
      blue: {
        main: "text-blue-100  bg-gradient-to-r from-transparent to-blue-800 to-5% border-b-2 border-blue-700 focus:to-blue-600",
        sublist: "bg-blue-700 text-blue-100 bg-blue-700",
        description: "bg-blue-700 text-blue-100 bg-blue-700",
        containerLevel0: "bg-blue-700",
      },
      green: {
        main: "text-green-100  bg-gradient-to-r from-transparent to-green-800 to-5% border-b-2 border-green-700 focus:to-green-600",
        sublist: "bg-green-700 text-green-100 bg-green-700 border-opacity-10",
        description:
          "bg-green-700 text-green-100 bg-green-700 border-opacity-10",
        containerLevel0: "bg-green-700",
      },
      yellow: {
        main: "text-yellow-100  bg-gradient-to-r from-transparent to-yellow-800 to-5% border-b-2 border-yellow-700 focus:to-yellow-600",
        sublist:
          "bg-yellow-700 text-yellow-100 bg-yellow-700 border-opacity-10",
        description:
          "bg-yellow-700 text-yellow-100 bg-yellow-700 border-opacity-10",
        containerLevel0: "bg-yellow-700",
      },
      orange: {
        main: "text-orange-100  bg-gradient-to-r from-transparent to-orange-800 to-5% border-b-2 border-orange-700 focus:to-orange-600",
        sublist:
          "bg-orange-700 text-orange-100 bg-orange-700 border-opacity-10",
        description:
          "bg-orange-700 text-orange-100 bg-orange-700 border-opacity-10",
        containerLevel0: "bg-orange-700",
      },
      purple: {
        main: "text-purple-100  bg-gradient-to-r from-transparent to-purple-800 to-5% border-b-2 border-purple-700 focus:to-purple-600",
        sublist:
          "bg-purple-700 text-purple-100 bg-purple-700 border-opacity-10",
        description:
          "bg-purple-700 text-purple-100 bg-purple-700 border-opacity-10",
        containerLevel0: "bg-purple-700",
      },
      pink: {
        main: "text-pink-100  bg-gradient-to-r from-transparent to-pink-800 to-5% border-b-2 border-pink-700 focus:to-pink-600",
        sublist: "bg-pink-700 text-pink-100 bg-pink-700 border-opacity-10",
        description: "bg-pink-700 text-pink-100 bg-pink-700 border-opacity-10",
        containerLevel0: "bg-pink-700",
      },
      indigo: {
        main: "text-indigo-100  bg-gradient-to-r from-transparent to-indigo-800 to-5% border-b-2 border-indigo-700 focus:to-indigo-600",
        sublist: "bg-indigo-700 text-indigo-100 bg-indigo-700",
        description: "bg-indigo-700 text-indigo-100 bg-indigo-700",
        containerLevel0: "bg-indigo-700",
      },
      gray: {
        main: "text-gray-100  bg-gradient-to-r from-transparent to-gray-800 to-5% border-b-2 border-gray-400 border-opacity-10 focus:to-gray-600",
        sublist: "text-gray-100",
        description:
          "bg-gradient-to-r from-transparent to-gray-800 to-5% text-gray-100",
        containerLevel0: "bg-gray-700",
      },
    },
  },
  defaultVariants: {
    color: "gray",
  },
});

function TreeNode({ item, level = 0 }: { item: TreeItem; level?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const { main, sublist, description, containerLevel0 } = variants({
    color: item.color,
  });

  function handleClick() {
    setIsExpanded(!isExpanded);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault(); // Prevent scrolling for Space key
      handleClick();
    }
  }

  return (
    <div className={twMerge("w-full", level === 0 ? containerLevel0() : "")}>
      <div
        tabIndex={hasChildren ? 0 : undefined}
        aria-expanded={isExpanded}
        role={hasChildren ? "treeitem" : undefined}
        className={twMerge(main(), hasChildren && "cursor-pointer", " ")}
        onClick={hasChildren ? handleClick : undefined}
        onKeyDown={hasChildren ? handleKeyDown : undefined}
      >
        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
        <div className="flex-grow">
          <Text>{item.label}</Text>
          <Text className="opacity-60" variant="label">
            {item.tooltip}
          </Text>
        </div>
        <div className="text-right flex-shrink-0">
          {item.value && (
            <Text variant="bodySmall" className="font-medium">
              {item.value}
            </Text>
          )}
          {item.subValue && (
            <Text variant="caption" className="text-gray-400">
              {item.subValue}
            </Text>
          )}
        </div>
        {hasChildren && (
          <>
            {isExpanded ? (
              <ArrowDown01Icon className={`w-4 h-4`} />
            ) : (
              <ArrowLeft01Icon className={`w-4 h-4`} />
            )}
          </>
        )}
      </div>
      <AnimatePresence initial={false} mode="sync" presenceAffectsLayout={true}>
        {item.description && (isExpanded || !hasChildren) && (
          <motion.div
            transition={{ duration: 0.2 }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            key="description"
          >
            {typeof item.description === "string" ? (
              <Text
                variant="bodySmall"
                className={twMerge("p-4", description())}
              >
                {item.description}
              </Text>
            ) : (
              item.description
            )}
          </motion.div>
        )}
        {hasChildren && isExpanded && (
          <motion.div
            transition={{ duration: 0.2 }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={twMerge("pl-4", sublist())}
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
    <div className={twMerge("rounded-md overflow-hidden", className)}>
      {items.map((item, index) => (
        <TreeNode key={index} item={item} />
      ))}
    </div>
  );
}
