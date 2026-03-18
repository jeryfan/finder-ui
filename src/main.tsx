import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const ExamplesApp = lazy(() => import('../examples/index'))

function Root() {
  const showExamples = window.location.hash === '#examples'

  if (showExamples) {
    return (
      <Suspense fallback={<div style={{ padding: 24 }}>Loading examples...</div>}>
        <ExamplesApp />
      </Suspense>
    )
  }

  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
