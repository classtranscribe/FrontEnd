import React from 'react';
import { Button } from 'pico-ui';
import { Popup } from 'semantic-ui-react';

function ChapterTitleButton({
  show=false,
  content="",
  icon="",
  color="blue",
  className="",
  onClick=null
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
            onClick={onClick}
          />
        </div>
      }
    />
  ) : null;
}

export default ChapterTitleButton;
