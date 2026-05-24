export function getNextPreviewTabIndex({
  currentIndex,
  tabCount,
  direction,
}: {
  currentIndex: number
  tabCount: number
  direction: 'next' | 'previous' | 'first' | 'last'
}) {
  if (tabCount <= 0) return -1

  switch (direction) {
    case 'next':
      return currentIndex < tabCount - 1 ? currentIndex + 1 : 0
    case 'previous':
      return currentIndex > 0 ? currentIndex - 1 : tabCount - 1
    case 'first':
      return 0
    case 'last':
      return tabCount - 1
  }
}
