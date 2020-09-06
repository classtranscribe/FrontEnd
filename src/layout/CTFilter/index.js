import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { search } from 'utils/search';

import DefaultFilter from './DefaultFilter';
import './index.scss';

export { default as CTFilterInput } from './DefaultFilter';

/**
 * A general filter component for classtranscribe
 * can be used to get the data at least one of specified attributes of which 
 * contains all the target values
 * 
 * @example
 * // render a filter with input field, which will filter the data on 'name' for the value entered in the input field 
 * and show the result as a list of MediaItem.
 * <CTFilter
 *    withDefaultFilter
 *    data={[{name:'aaaa',instructor:a},...,{name:'zzzz',instructor:z}]}
 *    keys={['name']}
 *  >
 *    {(result) => {
 *      whElement = result.map(media => <MediaItem media={media} />);
 *      return (
 *      <CTFragment dFlexCol role="list">
 *        {whElement}
 *      </CTFragment>
 *      );
 *    }}
 *  </CTFilter>
 */
function CTFilter(props) {
  let {
    data = [],
    value = '',
    keys,
    regexFlags = 'i',
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
    // in the case when withDefaultFilter = false,
    // update target value when new `value` passed from the outer input field changes
    setFilterVal(value);
  }, [value]);

  useEffect(() => {
    // in the case when withDefaultFilter = false,
    // update reversed when new `reversed` passed  from the outer input field changes
    setThisReversed(reversed);
  }, [reversed]);

  useEffect(() => {
    // reset everything when data changes
    setResult(data);
    setFilterVal(value);
    setThisReversed(reversed);
  }, [data]);

  useEffect(() => {
    // update result when target value changes
    let res = getResult(filterVal);
    setResult(res);

    // if the callback is provided
    if (typeof onFilterValueChange === 'function') {
      onFilterValueChange(filterVal);
    }
  }, [filterVal]);

  useEffect(() => {
    // if the callback is provided
    if (typeof onReversed === 'function') {
      onReversed(thisReversed);
    }
  }, [thisReversed]);

  const handleReverse = () => {
    setThisReversed(rev => !rev)
    setResult(result.slice().reverse());
  };

  let defaultFilterElement = null;
  // default input field component where target value can be entered
  if (withDefaultFilter) {
    const defaultFilterProps = {
      value: filterVal,
      placeholder: 'Filter...',
      reversed: thisReversed,
      onInputChange: ({ target }) => setFilterVal(target.value),
      onToggleReverse: handleReverse
    };
    defaultFilterElement = <DefaultFilter {...defaultFilterProps} />;
  }

  let resultReceiver = null;
  // component showing filtered result
  if (typeof children === 'function') {
    resultReceiver = children(result, setResult);
  }

  return (
    <>
      {defaultFilterElement}
      {resultReceiver}
    </>
  );
}

CTFilter.propTypes = {
  /** an array of objects, data to be filtered */
  data: PropTypes.array.isRequired,

  /** target value */
  value: PropTypes.string,

  /** attributes on which the data will be fitered */
  keys: PropTypes.arrayOf(PropTypes.string),

  /** specify  the flag of RegExp, default 'gi' */
  regexFlags: PropTypes.string,

  /** indicate whether the result has been reversed */
  reversed: PropTypes.bool,

  /** indicate whether the component will provide a default input field where target value can be entered */
  withDefaultFilter: PropTypes.bool,

  /** function that takes the filtered result and returns a component showing the result */
  children: PropTypes.func,

  /** call-back function for changing 'value' which takes 'value' as param */
  onFilterValueChange: PropTypes.func,

  /** call-back function for changing 'reversed' which takes 'reversed' as param */
  onReversed: PropTypes.func
};

export default CTFilter;