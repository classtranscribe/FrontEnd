import { useEffect } from 'react';
import { api } from 'utils';

/**
 * The hooks that cancels the CT loading wrapper as soon as the components are rendered
 * @param {Function} callback function called when the component is rendered
 */
export function useLoaded(callback) {
  useEffect(() => {
    if (typeof callback === 'function') {
      callback();
    }

    api.contentLoaded();
  }, []);
}