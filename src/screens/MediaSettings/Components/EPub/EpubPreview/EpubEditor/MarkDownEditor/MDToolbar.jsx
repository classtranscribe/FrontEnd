import React from 'react';
import { epub } from 'screens/MediaSettings/Utils/epub';
import { Button } from 'pico-ui';

function MDToolbar({
  dark,
  editorFullscreen
}) {

  return (
    <div className="ee-editor-ctrl-bar">
      <div className="d-flex align-items-center">
        <Button compact
          classNames="mr-2"
          icon={dark ? 'brightness_7' : 'brightness_4'}
          color={dark ? "black" : 'transparent'}
          onClick={epub.changeTheme}
        />
        <Button compact
          icon={editorFullscreen ? "fullscreen_exit" : "fullscreen"}
          color={dark ? "black" : 'transparent'}
          onClick={epub.handleFullscreenChange}
        />
      </div>
    </div>
  );
}

export default MDToolbar;