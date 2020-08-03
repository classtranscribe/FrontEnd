import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLoader } from 'layout';
import { NoEPubWrapper } from '../components';
import { epub, CTEPubConstants as Constants } from '../controllers';
import { epubStore, connectWithRedux } from '../redux';
import EPubGenerator from './EPubGenerator';
import Poster from './Poster';
import EPubList from './EPubList';
import './index.scss';

function LaunchScreenWithRedux(props) {
  const {
    // props
    media,
    // states
    error,
    epubs,
    currEPub,
    step
  } = props;

  const { hash } = useLocation();
  const loading = epub.list.isLoading(epubs);
  const canStartGenerator = epub.list.canStartGenerator(currEPub, step);

  useEffect(() => {
    // register redux dispatch functions
    epub.state.init(props);
    // reset the redux store when the component is unmounted
    // return epub.state.resetStates;
  }, []);

  useEffect(() => {
    if (media && media.id) {
      epub.list.setupLaunchScreen(media)
    }
  }, [media]);

  useEffect(() => {
    if (!hash) {
      epub.state.setCurrEPub(null);
    }

    epub.list.determineStep(hash);
  }, [hash]);

  return (
    <div 
      id={Constants.LaunchScreenContainerID}
      className="ct-epb launch-con ct-a-fade-in"
    >
      {
        error ? (
          <NoEPubWrapper mediaId={media.id} error={error} />
        ) : loading ? (
          <div className="w-100"><CTLoader /></div>
        ) : canStartGenerator ? (
          <EPubGenerator media={media} epubDataLike={currEPub} />
        ) : (
          <>
            <Poster />
            <EPubList media={media} />
          </>
        )
      }
    </div>
  );
}

const LaunchScreen = withReduxProvider(
  LaunchScreenWithRedux,
  epubStore,
  connectWithRedux,
  ['epubs', 'error', 'currEPub', 'step'],
  ['all']
);

LaunchScreen.propTypes = {
  media: PropTypes.object.isRequired
};

export default LaunchScreen;


