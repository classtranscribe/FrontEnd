import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import { search } from 'utils';
import './index.css';

export function CTSearch({
  id = '',
  required = false,
  label = '',
  color = 'primary',
  options = [],
  value,
  classNames = '',

  description,
  error,
  placeholder,
  defaultValue,
  onChange,
}) {
  const [selOpt, setSelOpt] = useState(_.find(options, { value }) || {});
  const [opts, setOpts] = useState(options);
  const [searchValue, setSearchValue] = useState(selOpt.text || '');

  useEffect(() => {
    if (Boolean(defaultValue) && options.length > 0) {
      const selOpt_ = _.find(options, { value: defaultValue }) || {};
      setSearchValue(selOpt_.text);
      setSelOpt(selOpt_);
    }
  }, [defaultValue]);

  const handleSearch = (value_) => {
    if (value_ === '') return setOpts(options);
    // let isMatch = search.getMatchFunction(value, ['text', 'value'])
    const searchedOpts = search.getResults(options, value_, ['text', 'value']); // _.filter( options, isMatch )
    setOpts(searchedOpts);
  };

  const handleSelect = (opt) => () => {
    setSelOpt(opt);
    handleSearch('');
    setSearchValue(opt.text || '');
    if (onChange) onChange(opt.value);
    if (document.activeElement) document.activeElement.blur();
  };

  const handleKeydownSelect = (opt) => (e) => {
    if (e.keyCode === 13) {
      handleSelect(opt)();
    }
  };

  const handleChange = ({ target }) => {
    setSearchValue(target.value);
    handleSearch(target.value);
    if (onChange) onChange(target.value);
  };

  const onBlur = () => {
    setSearchValue(selOpt.text || '');
  };

  const onFocus = () => {
    setSearchValue('');
    handleSearch('');
  };

  return (
    <div className="ct-ipt-con" data-color={color}>
      <label className="ct-ipt-label" htmlFor={id} data-error={Boolean(error)}>
        {label}
        {required && (
          <span className="ct-ipt-required-icon" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div className="ct-ipt">
        <div className="ct-ipt-sel-con">
          <div className="ct-ipt-text ct-ipt-sea-text" tabIndex="-1" data-error={Boolean(error)}>
            <div className="ct-ipt-input-con ct-ipt-sea-input-con">
              <input
                id={id}
                required={required}
                className={`${classNames}`}
                value={searchValue}
                placeholder={selOpt.text || placeholder}
                onChange={handleChange}
                onBlur={onBlur}
                onFocus={onFocus}
              />
            </div>
            <div className="ct-ipt-sel-drop-icon">
              <i className="material-icons">arrow_drop_down</i>
            </div>
          </div>
        </div>
        <div className="ct-ipt-sea-opts">
          {opts.map((opt) => (
            <div
              key={opt.value}
              tabIndex="0"
              className="ct-ipt-sea-opt"
              onClick={handleSelect(opt)}
              onKeyDown={handleKeydownSelect(opt)}
              data-current={Boolean(opt.value === selOpt.value)}
            >
              {opt.text} <br />
              {opt.detail && <strong>{opt.detail}</strong>}
            </div>
          ))}

          {opts.length === 0 && (
            <div tabIndex="0" className="ct-ipt-sea-opt" data-disabled>
              None
            </div>
          )}
        </div>
      </div>
      {Boolean(description) && <div className="ct-ipt-description">{description}</div>}
      {Boolean(error) && <div className="ct-ipt-description ct-ipt-error">{error}</div>}
    </div>
  );
}
