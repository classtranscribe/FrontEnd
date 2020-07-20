import React, { createElement, useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import { Button } from 'pico-ui';
import { elem } from 'utils/use-elem';
import './index.scss';

export function ChapterTitle({
  id,
  className = '',
  value,
  headingType = 'h3',
  focus,
  label = 'Title',
  placeholder = 'Title',
  required = true,

  onSave,
  ...otherProps
}) {
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef();

  const handleFocus = (e) => {
    // to do select all
  };

  const handleInput = (e) => {
    setInputValue(e.target.innerText);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(inputValue);
    }
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();

      handleSave();
      e.target.blur();
    }
  };

  const style = cx('ct-epb', 'ch-edit-title', className, headingType, { focused: focus });

  useEffect(() => {
    elem.addPastePlainTextEventListener(inputRef.current);
  }, []);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const changed = value !== inputValue;

  const inputComponent = createElement(headingType, {
    ref: inputRef,
    className: 'ct-epb ch-edit-title-txt clickable',
    contentEditable: true,
    children: value,
    tabIndex: 0,
    onFocus: handleFocus,
    onInput: handleInput,
    onKeyDown,
    role: 'textbox',
    'aria-placeholder': placeholder,
    'aria-label': label,
    'aria-required': required,
    ...otherProps,
  });

  return (
    <div id={id} className={style}>
      {changed && (
        <Button
          compact
          classNames="mr-2 ct-a-fade-in"
          color="transparent teal"
          text="SAVE"
          onClick={handleSave}
        />
      )}

      {inputComponent}
    </div>
  );
}
