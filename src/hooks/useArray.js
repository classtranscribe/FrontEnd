import _ from 'lodash';
import { useState, useEffect } from 'react';

const isValidIndex = (index, array) => (
  typeof index === 'number' 
  && index >= 0 
  && index < array.length
);

/**
 * The react hook for handing array states
 * @param {Any[]} initialValue - the initial value to the array
 * @param {Function} onChange - callback function on array changes
 */
export function useArray(initialValue, onChange) {
  const [value, setValue] = useState(Array.isArray(initialValue) ? initialValue : []);

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(value);
    }
  }, [value]);

  /**
   * Push item the to end of the array
   * @param {Any} item the item to push to the array
   */
  const push = (item) => {
    setValue([ ...value, item ]);
  };

  /**
   * Push item the to start of the array
   * @param {Any} item the item to push to the array
   */
  const pushStart = (item) => {
    setValue([ item, ...value ]);
  };

  /**
   * Determine if an item is in the array
   * @param {Any} item the item that could be in the array
   * @returns {Boolean} true if the item is in the array
   */
  const includes = (item) => {
    return _.includes(value, item);
  }

  /**
   * Remove item at the index from the array
   * @param {Number} index 
   * @returns {Any} the removed item
   */
  const removeIndex = (index) => {
    if (isValidIndex(index, value)) {
      const [removed] = value.splice(index, 1);
      setValue([ ...value ]);
      return removed;
    }

    return null;
  };

  /**
   * Remove the exact item from the array
   * @param {Any} item - the exact item to remove
   * @returns {Any} the removed item
   */
  const removeExact = (item) => {
    setValue([ ..._.filter(value, it => it !== item) ]);

    return item;
  };

  /**
   * Remove the exact items from the array
   * @param {Any[]} items - the exact items to remove
   * @returns {Any} the removed items
   */
  const removeItems = (items) => {
    setValue([ ..._.filter(value, it => !items.includes(it)) ]);
    return items;
  };

  /**
   * Remove the items from the array based on the predicate
   * @param {Function|Object} predicate - the function invoked per iteration
   * @returns {Any[]} the removed items
   */
  const remove = (predicate) => {
    const removedItems = _.remove(value, predicate);
    setValue([ ...value ]);
    return removedItems;
  };

  /**
   * Insert the item at the index in the array
   * @param {Number} index - the index to be inserted in
   * @param {Any} item - the item to insert
   */
  const insert = (index, item) => {
    if (isValidIndex(index, value)) {
      value.splice(index, 0, item);
      setValue([ ...value ]);
    }
  };

  /**
   * Update the item at the index in the array
   * @param {Number} index - the index to be updated in
   * @param {Any} item - the item to update
   * @param {Boolean} replace - true if entirely replace the item, default to be true
   */
  const updateIndex = (index, item, replace = true) => {
    if (isValidIndex(index, value)) {
      value.splice(index, 1, replace ? item : { ...value[index], ...item });
      setValue([ ...value ]);
    }
  };

  /**
   * Update the predicated item in the array
   * @param {Any} predicate - the function invoked per iteration
   * @param {Any} item - the item to update
   */
  const update = (predicate, item) => {
    const itemIndex = _.findIndex(value, predicate);
    if (typeof item === 'function') {
      updateIndex(itemIndex, item(value[itemIndex]));
    } else {
      updateIndex(itemIndex, item);
    }
  };

  /**
   * Move the item at `fromIndex` to the `toIndex` and shift the others
   * @param {Number} fromIndex - the index of item to move from
   * @param {Number} toIndex - the index of item to move to
   */
  const reorder = (fromIndex, toIndex) => {
    if (!isValidIndex(fromIndex) || !isValidIndex(toIndex)) return;

    const [removed] = value.splice(fromIndex, 1);
    value.splice(toIndex, 0, removed);
    setValue([ ...value ]);
  };

  /**
   * Find the index of the predicated item in the array
   * @param {Any} predicate - the function invoked per iteration
   * @returns {Number} the index of the predicated item in the array
   */
  const findIndex = (predicate) => {
    return _.findIndex(value, predicate)
  };

  /**
   * Find the predicated item in the array
   * @param {Any} predicate - the function invoked per iteration
   * @returns {Any} the predicated item in the array
   */
  const find = (predicate) => {
    return _.find(value, predicate);
  };

  /**
   * Sort the array based on iteratee (https://lodash.com/docs/4.17.15#sortBy)
   * @param {Function[]|String[]} iteratee - See https://lodash.com/docs/4.17.15#sortBy
   */
  const sortBy = (iteratee) => {
    setValue(_.sortBy(value, iteratee));
  };

  /**
   * Reverse the array
   */
  const reverse = () => {
    setValue(value.slice().reverse());
  };

  /**
   * Compares two array, and returns the items in this array and not anothor array
   * See https://lodash.com/docs/4.17.15#differenceBy for more
   * @param {Any[]} array - the another array to compare
   * @param {Any} iteratee - See https://lodash.com/docs/4.17.15#differenceBy for more 
   * @returns {Any[]} the items that the another array don't contains
   */
  const includesMore = (array, iteratee) => {
    return _.differenceBy(value, array, iteratee);
  };

  /**
   * Compares two array, and returns the items in anothor array and not in this array.
   * See https://lodash.com/docs/4.17.15#differenceBy for more
   * @param {Any[]} array - the another array to compare
   * @param {Any} iteratee - See https://lodash.com/docs/4.17.15#differenceBy for more
   * @returns {Any[]} the items in anothor array and not in this array
   */
  const includesLess = (array, iteratee) => {
    return _.differenceBy(array, value, iteratee);
  };

  return {
    value,
    length: value.length,
    isEmpty: value.length === 0,
    setValue,
    clear: () => setValue([]),
    reset: () => setValue(initialValue),
    includes,
    push,
    pushStart,
    removeIndex,
    removeExact,
    removeItems,
    remove,
    insert,
    updateIndex,
    update,
    findIndex,
    find,
    sortBy,
    reorder,
    reverse,
    includesMore,
    includesLess,
  };
}