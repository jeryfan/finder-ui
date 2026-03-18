import type { SidebarTab } from '@/types'
import { useFinderStore } from '@/store'
import { HardDriveIcon } from '@/icons'
import { cn } from '@/utils'

export type SidebarProps = {
  tabs: SidebarTab[]
  className?: string
}

export function Sidebar({ tabs, className }: SidebarProps) {
  const { activeTab, setActiveTab, openContextMenu } = useFinderStore()

  const handleContextMenu = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement
    if (target.closest('[data-sidebar-tab="true"]')) return
    event.preventDefault()
    openContextMenu(event.clientX, event.clientY, null, 'empty')
  }

  return (
    <aside
      className={cn(
        'w-44 shrink-0 border-r border-border bg-sidebar transition-all duration-200',
        'h-full flex flex-col',
        className,
      )}
      onContextMenu={handleContextMenu}
    >
      <div className="p-2">
        <div className="mb-2 px-2 text-xs font-medium tracking-[0.6px] text-muted-foreground">
          Files
        </div>
        {tabs.length === 0 ? (
          <div className="px-2 py-4 text-center text-xs text-muted-foreground">
            No tabs configured
          </div>
        ) : (
          <div className="space-y-0.5">
            {tabs.map((tab) => {
              const TabIcon = tab.icon || HardDriveIcon
              return (
                <button
                  key={tab.key}
                  data-sidebar-tab="true"
                  onClick={() => setActiveTab(tab.key)}
                  onContextMenu={(event) => {
                    event.preventDefault()
                    openContextMenu(event.clientX, event.clientY, null, 'empty')
                  }}
                  className={cn(
                    'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors text-foreground',
                    activeTab === tab.key
                      ? 'bg-active'
                      : 'hover:bg-muted',
                  )}
                >
                  <TabIcon className="w-[18px] h-[18px] flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </aside>
  )
}
