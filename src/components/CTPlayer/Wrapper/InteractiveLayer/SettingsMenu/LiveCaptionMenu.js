import React from 'react';
import MenuItem from './MenuItem';

function LiveCaptionMenu(props) {
  let {
    fontSize,
    setFontSize,
    onGoBack,
  } = props;

  const fontSizes = ["small", "normal", "large"];
  // console.log(fontSize);

  return (
    <div className="ctp settings-menu">
      <MenuItem goBack text="Live Caption Font Size" onClick={onGoBack} />

      {fontSizes.map(size => (
        <MenuItem
          key={size}
          text={size.toString()}
          active={size === fontSize}
          onClick={() => setFontSize(size)}
        />
      ))}

    </div>
  );
}


export default LiveCaptionMenu;
