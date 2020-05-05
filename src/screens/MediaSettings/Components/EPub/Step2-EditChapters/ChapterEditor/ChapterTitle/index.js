import React, { createElement, useState } from 'react';
import { Button } from 'pico-ui'
import classNames from 'classnames';
import './index.scss';

function ChapterTitle({
  id,
  className='',
  value,
  onSave,
  headingType='h3'
}) {

  const [changed, setChanged] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleInput = e => {
    setInputValue(e.target.innerText);

    if (e.target.innerText === value) {
      setChanged(false);
    } else {
      setChanged(true);
    }
  }

  const handleSave = () => {
    setChanged(false);

    if (onSave) {
      onSave(inputValue);
    }
  }

  const onKeyDown = e => {
    if (e.keyCode === 13) {
      e.preventDefault();

      handleSave();
      e.target.blur();
    }
  }

  let style = classNames('ee-ech-ch-title',
    className,
    headingType,
    {
      focused
    }
  );

  const inputComponent = createElement(headingType, {
    className: 'ee-ech-ch-h',
    contentEditable: true,
    children: value,
    tabIndex: 0,
    onInput: handleInput,
    onKeyDown: onKeyDown,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  });

  return (
    <div 
      id={id}
      className={style}
    >
      {inputComponent}

      {
        changed
        &&
        <Button compact
          classNames="ml-2 ct-a-fade-in"
          color="transparent teal"
          text="SAVE"
          onClick={handleSave}
        />
      }
    </div>
  )
}

export default ChapterTitle;
