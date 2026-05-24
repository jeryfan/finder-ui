import type { PropsWithChildren, ReactNode } from 'react'

type ExampleFrameProps = PropsWithChildren<{
  toolbar?: ReactNode
}>

export function ExampleFrame({ toolbar, children }: ExampleFrameProps) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {toolbar ? (
        <div
          style={{
            padding: '8px 12px',
            display: 'flex',
            gap: 8,
            borderBottom: '1px solid #eee',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {toolbar}
        </div>
      ) : null}
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  )
}

export function ExampleNote({ children }: PropsWithChildren) {
  return <span style={{ fontSize: 13, color: '#666' }}>{children}</span>
}

export function ExampleDivider() {
  return <span aria-hidden="true" style={{ width: 1, height: 20, background: '#ddd' }} />
}

type ExampleButtonProps = {
  active?: boolean
  children: ReactNode
  onClick: () => void
}

export function ExampleButton({ active = false, children, onClick }: ExampleButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 10px',
        borderRadius: 4,
        border: '1px solid #ddd',
        fontSize: 13,
        cursor: 'pointer',
        background: active ? '#333' : '#fff',
        color: active ? '#fff' : '#333',
      }}
    >
      {children}
    </button>
  )
}
