import { useState, useEffect } from 'react';

export function useInput(initialValue, onChange) {
  const [value, setValue] = useState(initialValue);

  const handleChange = ({ target }) => {
    setValue(target.value);
  };

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(value);
    }
  }, [value]);

  return {
    value,
    isEmpty: value === '',
    setValue,
    onChange: handleChange,
    clear: () => setValue(''),
    reset: () => setValue(initialValue)
  };
}