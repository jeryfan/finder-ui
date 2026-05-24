import type { FinderLocale } from '@/locale'
import {
  ToolbarBreadcrumbs,
  type BreadcrumbItem,
} from './toolbar-breadcrumbs'
import { ToolbarNavigation } from './toolbar-navigation'
import { ToolbarSearch } from './toolbar-search'
import {
  ToolbarViewToggle,
  type ToolbarViewMode,
} from './toolbar-view-toggle'

export type ToolbarProps = {
  historyIndex: number
  historyStackLength: number
  breadcrumbs: BreadcrumbItem[]
  viewMode: ToolbarViewMode
  searchQuery: string
  locale: FinderLocale
  onGoBack: () => void
  onGoForward: () => void
  onNavigate: (path: string) => void
  onViewModeChange: (mode: ToolbarViewMode) => void
  onSearchChange: (value: string) => void
}

export function Toolbar({
  historyIndex,
  historyStackLength,
  breadcrumbs,
  viewMode,
  searchQuery,
  locale,
  onGoBack,
  onGoForward,
  onNavigate,
  onViewModeChange,
  onSearchChange,
}: ToolbarProps) {
  return (
    <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-muted/20 px-3">
      <ToolbarNavigation
        historyIndex={historyIndex}
        historyStackLength={historyStackLength}
        locale={locale}
        onGoBack={onGoBack}
        onGoForward={onGoForward}
      />
      <ToolbarBreadcrumbs breadcrumbs={breadcrumbs} onNavigate={onNavigate} />
      <ToolbarViewToggle
        viewMode={viewMode}
        locale={locale}
        onViewModeChange={onViewModeChange}
      />
      <ToolbarSearch
        searchQuery={searchQuery}
        locale={locale}
        onSearchChange={onSearchChange}
      />
    </div>
  )
}
