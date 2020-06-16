/**
 * 
 * @param {KeyboardEvent} event 
 * @param {CTPlayerController} player 
 */
function playerKeyDownEventHandler(event, player) {
  const { keyCode, /* metaKey */ } = event;
  switch (keyCode) {
    // k or space - pause/play
    case 75:
    case 32:
      event.preventDefault();
      player.togglePause();
      return;
    
    // m - mute/unmute
    case 77:
      event.preventDefault();
      player.toggleMute();
      return;

    // left arrow - rewind
    case 37:
      event.preventDefault();
      player.rewind();
      return;

    // right arrow - forward
    case 39:
      event.preventDefault();
      player.forward();
      return;

    // top arrow - forward
    case 38:
      event.preventDefault();
      player.volumeUp();
      return;

    // bottom arrow - forward
    case 40:
      event.preventDefault();
      player.volumeDown();
      break;
      
    default:
  }
}

export default playerKeyDownEventHandler;