
/**
 * Function used to get the size for the player
 * @returns {{width:string, height:string}} the player's size object
 */
export function _getPlayerSize({ width, height, fill, isFullscreen }) {
  if (fill || isFullscreen) {
    return { width: '100%', height: '100%' };
  }

  return {
    width: `${width || 560 }px`,
    height: height ? (`${height }px`) : 'max-content'
  };
}