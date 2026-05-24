export function getNextContextMenuIndex({
  currentIndex,
  itemCount,
  direction,
}: {
  currentIndex: number
  itemCount: number
  direction: 'next' | 'previous' | 'first' | 'last'
}) {
  if (itemCount <= 0) return -1

  switch (direction) {
    case 'next':
      return currentIndex < itemCount - 1 ? currentIndex + 1 : 0
    case 'previous':
      return currentIndex > 0 ? currentIndex - 1 : itemCount - 1
    case 'first':
      return 0
    case 'last':
      return itemCount - 1
  }
}
