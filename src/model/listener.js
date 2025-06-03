import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const routeInitializers = [];

export function addSubscription(onLoad) {
  routeInitializers.push(onLoad);
}

const appLoadHandlers = [];

export function addInitializer(onLoad) {
  appLoadHandlers.push(onLoad);
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

  useEffect(() => {
    Promise.allSettled(appLoadHandlers.map((h) => h(dispatch)));
  }, [])

  return null;
}
