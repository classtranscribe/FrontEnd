import React from 'react';
import { Button } from 'pico-ui';
import { CTPopoverLabel } from 'layout';

function ChapterTitleButton({
  show=false,
  content="",
  icon="",
  color="transparent",
  outlined=true,
  className="",
  onClick=null,
}) {
  return show ? (
    <CTPopoverLabel label={content}>
      <div className={className}>
        <Button
          round
          icon={icon}
          color={color}
          outlined={outlined}
          onClick={onClick}
          aria-label={content}
        />
      </div>
    </CTPopoverLabel>
  ) : null;
}

export default ChapterTitleButton;
