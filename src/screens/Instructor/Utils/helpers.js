export function fileSizeParser(size) {
  let _size = size;
  const fSExt = ['Bytes', 'KB', 'MB', 'GB'];
  let i = 0;
  while (_size > 900) {
    _size /= 1024;
    i += 1;
  }
  const exactSize = `${Math.round(_size * 100) / 100} ${fSExt[i]}`;
  return exactSize;
}
