import React from 'react';
import { Button } from 'pico-ui';
import { Popup } from 'semantic-ui-react';

function ChapterTitleButton({
  show=false,
  content="",
  icon="",
  color="normal",
  outlined=false,
  className="",
  onClick=null,
}) {
  return show ? (
    <Popup inverted basic
      openOnTriggerMouseEnter
      openOnTriggerFocus
      openOnTriggerClick={false}
      closeOnTriggerBlur
      content={content}
      trigger={
        <div className={className}>
          <Button round
            icon={icon}
            color={color}
            outlined={outlined}
            onClick={onClick}
            aria-label={content}
          />
        </div>
      }
    />
  ) : null;
}

export default ChapterTitleButton;
