export function useCustomizedButton(handleClick) {
  const onClick = (e) => {
    if (typeof handleClick === 'function') {
      handleClick(e);
    }
  }

  const onKeyDown = (e) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
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