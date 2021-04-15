import _ from "lodash"
import { useRef, useEffect, useCallback } from 'react'

export default function useThrottle(cb, delay) {
  const options = { leading: true, trailing: false };
  const cbRef = useRef(cb);

  useEffect(() => { cbRef.current = cb; });
  return useCallback(
    _.throttle((...args) => cbRef.current(...args), delay, options),
    [delay]
  );
}