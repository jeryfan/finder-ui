import { lazy, Suspense, useMemo, useState, type ComponentType } from 'react'

const BasicExample = lazy(() => import('./examples/basic/App'))
const CustomThemeExample = lazy(() => import('./examples/custom-theme/App'))
const FileOperationsExample = lazy(() => import('./examples/file-operations/App'))
const I18nExample = lazy(() => import('./examples/i18n/App'))
const KitchenSinkExample = lazy(() => import('./examples/kitchen-sink/App'))
const MultipleInstancesExample = lazy(() => import('./examples/multiple-instances/App'))
const WithPreviewExample = lazy(() => import('./examples/with-preview/App'))

const EXAMPLES = [
  {
    key: 'kitchen-sink',
    name: 'Kitchen Sink',
    description: 'Multi-tab browsing, preview, editing, i18n, themes, upload, save, and download.',
    component: KitchenSinkExample,
  },
  {
    key: 'basic',
    name: 'Basic',
    description: 'Minimal setup with one tab and file listing only.',
    component: BasicExample,
  },
  {
    key: 'with-preview',
    name: 'With Preview',
    description: 'Preview Markdown, code, CSV, images, audio, video, and PDF files.',
    component: WithPreviewExample,
  },
  {
    key: 'file-operations',
    name: 'File Operations',
    description: 'Upload, save, and download callbacks wired to the local API.',
    component: FileOperationsExample,
  },
  {
    key: 'i18n',
    name: 'Internationalization',
    description: 'Switch locale strings at runtime.',
    component: I18nExample,
  },
  {
    key: 'custom-theme',
    name: 'Custom Theme',
    description: 'Theme variants and CSS variable overrides.',
    component: CustomThemeExample,
  },
  {
    key: 'multiple-instances',
    name: 'Multiple Instances',
    description: 'Two independent Finder instances sharing the same API.',
    component: MultipleInstancesExample,
  },
]

type ExampleKey = (typeof EXAMPLES)[number]['key']

type ExampleMeta = {
  key: ExampleKey
  name: string
  description: string
  component: ComponentType
}

const EXAMPLE_ITEMS: readonly ExampleMeta[] = EXAMPLES

function App() {
  const [activeKey, setActiveKey] = useState<ExampleKey>('kitchen-sink')
  const activeExample = useMemo(
    () => EXAMPLE_ITEMS.find((example) => example.key === activeKey) ?? EXAMPLE_ITEMS[0],
    [activeKey],
  )
  const ActiveComponent = activeExample.component

  return (
    <div
      className="h-screen w-screen flex bg-[#F9F6F1]"
      style={{
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <aside className="h-full w-72 flex-shrink-0 flex flex-col px-4 py-4 border-r border-[#EAE9E6]">
        <div className="mb-4">
          <h1 className="text-sm font-semibold text-[#2E2929]">finder-ui examples</h1>
          <p className="mt-1 text-xs leading-5 text-[#666666]">
            API server: 8010 · Vite: 5273
          </p>
        </div>

        <nav className="space-y-1" aria-label="Examples">
          {EXAMPLE_ITEMS.map((example) => {
            const active = example.key === activeKey
            return (
              <button
                key={example.key}
                type="button"
                onClick={() => setActiveKey(example.key)}
                className={`w-full text-left px-3 py-2 rounded-md border transition-colors ${
                  active
                    ? 'bg-[#2E2929] text-white border-[#2E2929]'
                    : 'bg-white text-[#2E2929] border-[#EAE9E6] hover:bg-[#F6F5F4]'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <span className="block text-xs font-semibold">{example.name}</span>
                <span className={`block mt-1 text-[11px] leading-4 ${active ? 'text-white/75' : 'text-[#777]'}`}>
                  {example.description}
                </span>
              </button>
            )
          })}
        </nav>
      </aside>

      <main className="flex-1 min-w-0 h-full p-4">
        <div className="h-full overflow-hidden rounded-lg border border-[#EAE9E6] bg-white">
          <Suspense
            fallback={
              <div className="h-full flex items-center justify-center text-sm text-[#666666]">
                Loading example...
              </div>
            }
          >
            <ActiveComponent />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

export default App
