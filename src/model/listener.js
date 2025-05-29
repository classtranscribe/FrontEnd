import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const routeInitializers = [];

export function addSubscription(onLoad) {
  routeInitializers.push(onLoad);
}


export default function RouteListener() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const pathname = location.pathname;
    for (const onLoad of routeInitializers) {
      onLoad(dispatch, pathname)
    }
  }, [location.pathname, dispatch]);

  return null;
}
