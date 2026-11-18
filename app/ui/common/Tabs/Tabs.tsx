import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  className?: string;
}

export function Tabs({ tabs, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className={twMerge("w-full", className)}>
      <div role="tablist" className="tabs tabs-boxed">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            className={twMerge("tab", activeTab === tab.id && "tab-active")}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`tabpanel-${tab.id}`}
          className={twMerge("p-4", activeTab !== tab.id && "hidden")}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
