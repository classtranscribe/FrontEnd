import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { search } from 'utils/search';

import DefaultFilter from './DefaultFilter';
import './index.scss';

export function CTFilter(props) {
  let {
    data = [],
    value = '',
    keys,
    regexFlags = 'gi',
    reversed = false,
    withDefaultFilter = false,
    children,
    onFilterValueChange,
    onReversed
  } = props;

  // Determine if the data is a valid array
  if (!Array.isArray(data)) {
    throw Error('The `data` passed to the CTFilter must be an array');
  }

  const [filterVal, setFilterVal] = useState(value);
  const [thisReversed, setThisReversed] = useState(reversed);
  const [result, setResult] = useState(data);

  // function used to get filter result
  const getResult = (val) => {
    return search.getResults(data, val, keys, {
      flags: regexFlags
    });
  };
  
  useEffect(() => {
    // update search value when value changes
    setFilterVal(value);
  }, [value]);

  useEffect(() => {
    // update search value when value changes
    setThisReversed(reversed);
  }, [reversed]);

  useEffect(() => {
    // reset everything when data changes
    setResult(data);
    setFilterVal(value);
    setThisReversed(reversed);
  }, [data]);

  useEffect(() => {
    // update result when search value changes
    let res = getResult(filterVal);
    setResult(res);

    // if the callback is provided
    if (typeof onFilterValueChange === 'function') {
      onFilterValueChange(filterVal);
    }
  }, [filterVal]);

  useEffect(() => {
    // update result when reversed changes
    let res = result.slice().reverse();
    setResult(res);

    // if the callback is provided
    if (typeof onReversed === 'function') {
      onReversed(thisReversed);
    }
  }, [thisReversed]);

  let defaultFilterElement = null;
  if (withDefaultFilter) {
    const defaultFilterProps = {
      value: filterVal,
      placeholder: 'Filter...',
      reversed: thisReversed,
      onInputChange: ({ target }) => setFilterVal(target.value),
      onToggleReverse: () => setThisReversed(rev => !rev),
    };
    defaultFilterElement = <DefaultFilter {...defaultFilterProps} />;
  }

  let resultReceiver = null;
  if (typeof children === 'function') {
    resultReceiver = children(result);
  }

  return (
    <>
      {defaultFilterElement}
      {resultReceiver}
    </>
  );
}

CTFilter.propTypes = {
  data: PropTypes.array.isRequired,
  value: PropTypes.string,
  keys: PropTypes.arrayOf(PropTypes.string),
  regexFlags: PropTypes.string,
  reversed: PropTypes.bool,
  withDefaultFilter: PropTypes.bool,
  children: PropTypes.func,
  onFilterValueChange: PropTypes.func,
  onReversed: PropTypes.func
};
