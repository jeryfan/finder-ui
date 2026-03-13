import type { SidebarTab } from "@/types";
import { useStore } from "@/store";
import { HardDriveIcon } from "@/icons";

export type SidebarProps = {
  tabs: SidebarTab[];
  className?: string;
};

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export function Sidebar({ tabs, className }: SidebarProps) {
  const { activeTab, setActiveTab, openContextMenu } = useStore();

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    openContextMenu(event.clientX, event.clientY, null, "empty");
  };

  return (
    <aside
      className={cn(
        "w-44 shrink-0 border-r border-[#EAE9E6] bg-[#F6F5F44D] transition-all duration-200",
        "h-full flex flex-col",
        className
      )}
      onContextMenu={handleContextMenu}
    >
      <div className="p-2">
        <div className="mb-2 px-2 text-xs font-medium tracking-[0.6px] text-[#A1A1AA]">
          Files
        </div>
        {tabs.length === 0 ? (
          <div className="px-2 py-4 text-center text-xs text-[#A1A1AA]">
            No tabs configured
          </div>
        ) : (
          <div className="space-y-0.5">
            {tabs.map((tab) => {
              const TabIcon = tab.icon || HardDriveIcon;
              return (
                <button
                  key={tab.key}
                  data-sidebar-tab="true"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors text-[#2E2929]",
                    activeTab === tab.key
                      ? "bg-[#E8E6E3]"
                      : "hover:bg-[#F6F5F4]"
                  )}
                >
                  <TabIcon className="w-[18px] h-[18px] flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
