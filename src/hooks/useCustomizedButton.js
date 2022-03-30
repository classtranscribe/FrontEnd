import * as KeyCode from 'keycode-js';

export function useCustomizedButton(handleClick) {
  const onClick = (e) => {
    if (typeof handleClick === 'function') {
      handleClick(e);
    }
  }

  const onKeyDown = (e) => {
    if (e.keyCode === KeyCode.KEY_RETURN || e.keyCode === KeyCode.KEY_SPACE) {
      onClick(e);
    }
  }

  return {
    role: 'button',
    tabIndex: '0',
    onClick, 
    onKeyDown
  };
}