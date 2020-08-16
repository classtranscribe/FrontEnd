import { homeState } from './HomeState';
import { homeCtrl } from './HomeController';
import HomeConstants from './HomeConstants';

export { homeStore, connectWithRedux } from 'redux/home';

export const home = {
  state: homeState,
  ctrl: homeCtrl,
  const: HomeConstants
};

export { default as HomePageConstants } from './HomeConstants';