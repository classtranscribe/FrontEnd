/**
 * 
 * @param {KeyboardEvent} event 
 * @param {CTPlayerController} player 
 */
export function handleKeyDownEvent(event, player) {
  const { keyCode, metaKey } = event;
  switch (keyCode) {
    // k or space - pause/play
    case 75:
    case 32:
      player.togglePause();
      return;
    
    // m - mute/unmute
    case 77:
      player.toggleMute();
      return;

    // left arrow - rewind
    case 37:
      player.rewind();
      return;

    // right arrow - forward
    case 39:
      player.forward();
      return;

    // top arrow - forward
    case 38:
      player.volumeUp();
      return;

    // bottom arrow - forward
    case 40:
      player.volumeDown();
      break;
      
    default:
  }
}