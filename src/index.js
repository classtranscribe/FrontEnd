import { React } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createBrowserHistory as createHistory } from 'history'
import createSagaMiddleware from 'redux-saga';
import * as sagaEffects from 'redux-saga/effects'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
// import dva from 'dva'
import { CourseFilter } from "screens/Home/components";
import App from './App'

// const app = dva({ history: createHistory() });
// window.temp_app = app
// app.model(require('./model/global').default);
// app.model(require('./screens/Home/model').default);
// app.model(require('./screens/Search/model').default);
// app.model(require('./screens/History/model').default);
// app.model(require('./screens/Course/model').default);
// app.model(require('./screens/Watch/model').default);
// app.model(require('./screens/Watch/playermodel').default);






// prefix namespace 
// //////////////////////////////////////////////////////////////////////////////////// //
// /////////////// copied from dva //////////////////////////////////// //
// prefix every action type with the namespace value,
// as in historypage/setWatchHistories
const NAMESPACE_SEP = '/'
function prefix(obj, namespace, type) {
  return Object.keys(obj).reduce((memo, key) => {
    // warning(
    //   key.indexOf(`${namespace}${NAMESPACE_SEP}`) !== 0,
    //   `[prefixNamespace]: ${type} ${key} should not be prefixed with namespace ${namespace}`,
    // );
    const newKey = `${namespace}${NAMESPACE_SEP}${key}`;
    memo[newKey] = obj[key];
    return memo;
  }, {});
}

function prefixNamespace(model) {
  const { namespace, reducers, effects } = model;

  if (reducers) {
    if (Array.isArray(reducers)) {
      // 需要复制一份，不能直接修改 model.reducers[0], 会导致微前端场景下，重复添加前缀
      const [reducer, ...rest] = reducers;
      model.reducers = [prefix(reducer, namespace, 'reducer'), ...rest];
    } else {
      model.reducers = prefix(reducers, namespace, 'reducer');
    }
  }
  if (effects) {
    model.effects = prefix(effects, namespace, 'effect');
  }
  return model;
}

// //////////////////////////////////////////////////////////////////////////////////////// //
// ////// Promise middleware ////////////////////////////////////////////////////////////// //
// ////// Copied from dva source code ///////////////////////////////////////////////////// //
// //////////////////////////////////////////////////////////////////////////////////////// //
function isEffect(type) {
  if (!type || typeof type !== 'string') return false;
  const [namespace] = type.split(NAMESPACE_SEP);
  // eslint-disable-next-line no-use-before-define
  const model = models.filter(m => m.namespace === namespace)[0];
  if (model) {
    if (model.effects && model.effects[type]) {
      return true;
    }
  }

  return false;
}

const promiseMiddleware = () => next => action => {
  const { type } = action;
  if (isEffect(type)) {
    return new Promise((resolve, reject) => {
      next({
        __dva_resolve: resolve,
        __dva_reject: reject,
        ...action,
      });
    });
    // eslint-disable-next-line no-else-return
  } else {
    return next(action);
  }
};

// //////////////////////////////////////////////////////////////////////////////////// //
// //////////////////////////////////////////////////////////////////////////////////// //


// dva()
// prefix models
let models = [];
function addModel(model) {
  const prefixedModel = prefixNamespace({ ...model });
  models.push(prefixedModel);
  return prefixedModel;
}

addModel(require('./model/global').default);
addModel(require('./screens/Home/model').default);
addModel(require('./screens/Search/model').default);
addModel(require('./screens/History/model').default);
addModel(require('./screens/Course/model').default);
addModel(require('./screens/Watch/model').default);
addModel(require('./screens/Watch/playermodel').default);



// add sagas and reducers by scanning each model
const sagas = [];
// const sagaMiddleware = createSagaMiddleware();
const _reducers = {

};

// //////////////////////////////////////////////////////////////////////////////////// //
// /////////// "Action handling" from dva ///////////////////////////////////////////// //
// //////////////////////////////////////////////////////////////////////////////////// //

function identify(value) {
  return value;
}


// Convert a reducer into a higher order reducer
//
function handleAction(actionType, reducer = identify) {
  return (state, action) => {
    const { type } = action;
    // invariant(type, 'dispatch: action should be a plain Object with type');
    if (actionType === type) {
      return reducer(state, action);
    }
    return state || {};
  };
}

// Combine two reducers done processing by handleAction(reducer1(state, type), reducer2(state, type))
// into a huge 'switch case' like: reducer1(reducer2(state, type), type), such that their results
// chains along the line of reducers. The equivalent of switch case but functional programming.
function reduceReducers(...reducers) {
  return (previous, current) => reducers.reduce((p, r) => r(p, current), previous);
}

function handleActions(handlers, defaultState) {
  // call handleAction() on each "reducer" defined in model
  // handleAction adds type checking (same as 'switch(type) case')
  const reducers = Object.keys(handlers).map(type => handleAction(type, handlers[type]));
  // generate a universal reducer for this model using reduceReducers()
  const reducer = reduceReducers(...reducers);
  return (state = defaultState, action) => reducer(state, action);
}

export default handleActions;

// //////////////////////////////////////////////////////////////////////////////////// //
// //////////////////////////////////////////////////////////////////////////////////// //

function getReducer(reducers, state) {
  return handleAction(reducers, state);
}

// ///// The put and take methods of the model should 
// /////  //
// //////////////////////////////////////////////////////////////////////////////////// //


function prefixType(type, _model) {
  const prefixedType = `${_model.namespace}${NAMESPACE_SEP}${type}`;
  const typeWithoutAffix = prefixedType.replace(/\/@@[^/]+?$/, '');

  const reducer = Array.isArray(_model.reducers)
    ? _model.reducers[0][typeWithoutAffix]
    : _model.reducers && _model.reducers[typeWithoutAffix];
  if (reducer || (_model.effects && _model.effects[typeWithoutAffix])) {
    return prefixedType;
  }
  return type;
}


function createEffects(model) {
  function assertAction(type, name) {
    // invariant(type, 'dispatch: action should be a plain Object with type');
    if (type.indexOf(`${model.namespace}${NAMESPACE_SEP}`) !== 0) {
      console.warn(
        `[${name}] ${type} should not be prefixed with namespace ${model.namespace}`
      );
    }
  }
  function put(action) {
    const { type } = action;
    assertAction(type, 'effects.put');
    return sagaEffects.put({ ...action, type: prefixType(type, model) });
  }

  function putResolve(action) {
    const { type } = action;
    assertAction(type, 'effects.put.resolve');
    return sagaEffects.put.resolve({
      ...action,
      type: prefixType(type, model),
    });
  }
  put.resolve = putResolve;

  function take(type) {
    if (typeof type === 'string') {
      assertAction(type, 'effects.take');
      return sagaEffects.take(prefixType(type, model));
    } if (Array.isArray(type)) {
      return sagaEffects.take(
        type.map(t => {
          if (typeof t === 'string') {
            assertAction(t, 'effects.take');
            return prefixType(t, model);
          }
          return t;
        })
      );
    }
    return sagaEffects.take(type);
  }
  return { ...sagaEffects, put, take };
}

// //////////////////////////////////////////////////////////////////////////////////// //
// //////////////////////////////////////////////////////////////////////////////////// //

function getWatcher(key, effect, model) {
  function noop() { }
  function* sagaWithCatch(...args) {
    const { __dva_resolve: resolve = noop, __dva_reject: reject = noop } =
      args.length > 0 ? args[0] : {};
    try {
      yield sagaEffects.put({ type: `${key}${NAMESPACE_SEP}@@start` });
      const ret = yield effect(...args.concat(createEffects(model)));
      yield sagaEffects.put({ type: `${key}${NAMESPACE_SEP}@@end` });
      resolve(ret);
    } catch (e) {
      // Removing universal error handler as it is not used.
      console.error(e);
    }
  }
  // Supporting only takeEvery() as this is the default and only high-order effect in use.
  return function* () {
    yield sagaEffects.takeEvery(key, sagaWithCatch);
  };
}



function getSaga(effects, model) {
  return function* () {
    for (const key in effects) {
      if (Object.prototype.hasOwnProperty.call(effects, key)) {
        const watcher = getWatcher(key, effects[key], model);
        const task = yield sagaEffects.fork(watcher);
        // Does not include cancel function because dynamic model 
        // loading is not used.
      }
    }
  }
}

// ///////////////////////////////////////////////////////////////////////////////////// //
// ///////////////////////////////////////////////////////////////////////////////////// //


const listeners = {}
const _getSaga = getSaga.bind(null);
for (const m of models) {
  _reducers[m.namespace] = getReducer(m.reducers, m.state);
  if (m.effects) sagas.push(_getSaga(m.effects, m));
}


const sagaMiddleware = createSagaMiddleware(sagas);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));
const reducersCombined = combineReducers({ ..._reducers, });
// Create Redux store with the above configurations
const store = createStore(reducersCombined, {}, enhancer);
store.runSaga = sagaMiddleware.run;
sagas.forEach(sagaMiddleware.run);

// eslint-disable-next-line no-debugger
// debugger;
// Run sagas
function prefixedDispatch(dispatch, model) {
  return action => {
    dispatch({
      ...action,
      type: prefixType(action.type, model)
    })
  }
}

function runSubscription(subs, model) {
  for (const key in subs) {
    if (Object.prototype.hasOwnProperty.call(subs, key)) {
      subs[key]({
        dispatch: prefixedDispatch(store.dispatch, model),
        // Todo: change way to access history, compatible with router v6
      });
    }
  }
}

// Run subscriptions
for (const m in models) {
  if (m.subscriptions) {
    runSubscription(m.subscriptions, m);
  }
}

// create router
// router v6 api
const router = createBrowserRouter([
  {
    path: "*",
    element: <App />,
  },
]);

// create react dom (to replace current version in version 18)
// ReactDOM.createRoot(document.getElementById("root")).render(
//   <Provider store={store}>
//     <RouterProvider router={router} />
//   </Provider>
// );

ReactDOM.render(
  <Provider store={store}>
    <Router><App /></Router>
  </Provider>,
  document.getElementById("root"));


// app.router(({ history }) => <Router history={history}><App app={app} /></Router>); // basename="/"
// app.start('#root')
/*
function registerModel(app, model) {
    try {
        app.model(model);
    } catch (e) { }
}
*/