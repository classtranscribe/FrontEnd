import React from 'react';
import { Icon } from 'semantic-ui-react';
import { CTText, CTInput } from 'layout';

function MediaName({
  mediaName,
  editing,
  inputValue,
  onInputChange,
  onSave,
}) {
  const handleFocus = (event) => {
    event.stopPropagation();
  };

  return editing ? (
    <CTInput
      label="Video Name"
      placeholder={mediaName}
      value={inputValue}
      onChange={onInputChange}
      onReturn={onSave}
      onFocus={handleFocus}
      onClick={handleFocus}
      className="ml-3"
      autoFocus
    />
  ) : (
    <>
      <Icon 
        name="file video" 
        size="big" 
        className="file-icon" 
        aria-hidden="true"
      />
      <CTText 
        bold 
        hoverTeal
        size="medium"
        line={1}
        className="media-name"
      >
        {mediaName}
      </CTText>
    </>
  )
}

export default MediaName
