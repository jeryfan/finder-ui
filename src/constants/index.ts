// File extension constants
export const MARKDOWN_EXTENSIONS = new Set(['md', 'markdown', 'mdx'])

export const CODE_EXTENSIONS = new Set([
  'py', 'ts', 'tsx', 'js', 'jsx', 'json', 'yml', 'yaml', 'toml', 'ini',
  'sh', 'bash', 'zsh', 'rb', 'go', 'rs', 'java', 'c', 'cc', 'cpp', 'h', 'hpp',
  'sql', 'css', 'scss', 'html', 'xml', 'txt', 'log', 'env', 'conf', 'cfg',
])

export const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'])
export const VIDEO_EXTENSIONS = new Set(['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'])
export const CODE_ICON_EXTENSIONS = new Set(['js', 'ts', 'jsx', 'tsx', 'py', 'go', 'rs', 'java', 'c', 'cpp', 'h', 'css', 'scss', 'html', 'xml'])
export const BRACES_EXTENSIONS = new Set(['json', 'yaml', 'yml', 'toml'])
export const SPREADSHEET_EXTENSIONS = new Set(['csv', 'xls', 'xlsx', 'xlsm'])
export const TEXT_EXTENSIONS = new Set(['txt', 'log'])
export const ARCHIVE_EXTENSIONS = new Set(['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'])

export const PREVIEWABLE_EXTENSIONS = new Set([
  ...MARKDOWN_EXTENSIONS,
  ...CODE_EXTENSIONS,
  ...TEXT_EXTENSIONS,
  'csv',
])
