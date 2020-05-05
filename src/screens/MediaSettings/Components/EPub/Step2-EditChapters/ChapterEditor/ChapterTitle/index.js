import React, { createElement, useState, useRef, useEffect } from 'react';
import { Button } from 'pico-ui'
import classNames from 'classnames';
import './index.scss';
import { util } from 'utils';

function ChapterTitle({
  id,
  className='',
  value,
  onSave,
  headingType='h3',
  focus,
  ...otherProps
}) {

  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef();

  const handleInput = e => {
    setInputValue(e.target.innerText);
  }

  const handleSave = () => {
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
      focused: focus
    }
  );

  useEffect(() => {
    util.elem.addPastePlainTextEventListener(inputRef.current);
  }, []);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const changed = value !== inputValue;

  const inputComponent = createElement(headingType, {
    ref: inputRef,
    className: 'ee-ech-ch-h',
    contentEditable: true,
    children: value,
    tabIndex: 0,
    onInput: handleInput,
    onKeyDown: onKeyDown,
    ...otherProps
  });

  return (
    <div 
      id={id}
      className={style}
    >
      {
        changed
        &&
        <Button compact
          classNames="mr-2 ct-a-fade-in"
          color="transparent teal"
          text="SAVE"
          onClick={handleSave}
        />
      }

      {inputComponent}
    </div>
  )
}

export default ChapterTitle;
