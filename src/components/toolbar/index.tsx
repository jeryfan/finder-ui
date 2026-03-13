import { ChevronLeftIcon, ChevronRightIcon, ChevronRightIcon as BreadcrumbSep } from '@/icons'
import { cn } from '@/utils'

export type ToolbarProps = {
  historyIndex: number
  historyStackLength: number
  breadcrumbs: Array<{ label: string; path: string }>
  viewMode: 'list' | 'grouped'
  searchQuery: string
  onGoBack: () => void
  onGoForward: () => void
  onNavigate: (path: string) => void
  onViewModeChange: (mode: 'list' | 'grouped') => void
  onSearchChange: (value: string) => void
}

export function Toolbar({
  historyIndex,
  historyStackLength,
  breadcrumbs,
  viewMode,
  searchQuery,
  onGoBack,
  onGoForward,
  onNavigate,
  onViewModeChange,
  onSearchChange,
}: ToolbarProps) {
  return (
    <div className="flex h-10 shrink-0 items-center gap-2 border-b border-[#EAE9E6] bg-[#F6F5F433] px-3">
      <div className="flex items-center gap-0.5">
        <button
          onClick={onGoBack}
          disabled={historyIndex <= 0}
          className={cn(
            'p-1 rounded hover:bg-[#F6F5F4] transition-colors',
            historyIndex <= 0 && 'cursor-not-allowed opacity-30',
          )}
          aria-label="Back"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <button
          onClick={onGoForward}
          disabled={historyIndex >= historyStackLength - 1}
          className={cn(
            'p-1 rounded hover:bg-[#F6F5F4] transition-colors',
            historyIndex >= historyStackLength - 1 && 'cursor-not-allowed opacity-30',
          )}
          aria-label="Forward"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-1 text-sm font-medium">
        {breadcrumbs.length === 1
          ? <span className="font-semibold text-[#2E2929]">{breadcrumbs[0].label}</span>
          : breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1
              return (
                <div key={crumb.path} className="flex min-w-0 items-center gap-1">
                  <button
                    onClick={() => onNavigate(crumb.path)}
                    className={cn(
                      'truncate text-sm transition-colors',
                      isLast ? 'font-semibold text-[#2E2929]' : 'font-medium text-[#2E2929] hover:text-[#2E2929]/80',
                    )}
                  >
                    {crumb.label}
                  </button>
                  {!isLast && <BreadcrumbSep className="h-4 w-4 text-[#666666]" />}
                </div>
              )
            })}
      </div>

      <div className="flex items-center gap-0.5 border border-[#EAE9E6] rounded-md p-0.5">
        <button
          onClick={() => onViewModeChange('grouped')}
          className={cn('p-1 rounded transition-colors', viewMode === 'grouped' ? 'bg-[#F6F5F4]' : 'hover:bg-[#F6F5F480]')}
          aria-label="Grouped view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
          </svg>
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={cn('p-1 rounded transition-colors', viewMode === 'list' ? 'bg-[#F6F5F4]' : 'hover:bg-[#F6F5F480]')}
          aria-label="List view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 5h.01" />
            <path d="M3 12h.01" />
            <path d="M3 19h.01" />
            <path d="M8 5h13" />
            <path d="M8 12h13" />
            <path d="M8 19h13" />
          </svg>
        </button>
      </div>

      <div className="relative">
        <svg className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-[#666666] pointer-events-none" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
          <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={event => onSearchChange(event.target.value)}
          placeholder="Search"
          className="w-32 h-7 pl-7 pr-2 text-xs bg-[#F6F5F480] border border-[#EAE9E6] rounded-md text-[#2E2929] focus:outline-none focus:ring-1 focus:ring-[#F59E0B]"
        />
      </div>
    </div>
  )
}
