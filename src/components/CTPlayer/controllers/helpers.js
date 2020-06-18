export function getPlayerSize({ width, height, fill, isFullscreen }) {
  if (fill || isFullscreen) {
    return { width: '100%', height: '100%' };
  }

  return {
    width: `${width || 560 }px`,
    height: height ? (`${height }px`) : 'max-content'
  };
}