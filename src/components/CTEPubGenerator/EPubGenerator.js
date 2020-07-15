import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { withReduxProvider } from 'redux/redux-provider';
import { epubStore, connectWithRedux } from './redux';
import { epub, CTEPubConstants as Constants } from './controllers';

function EPubGenerator(props) {
  const {
    mediaId,
    title,
    // states
    error,
    language,
    rawEPubData,
    epubs,
    currEPubIndex
  } = props;
  const { hash } = useLocation();
  const loading = epub.ctrl.isLoading(rawEPubData);

  useEffect(() => {
    // register redux dispatch functions
    epub.state.init(props);
    // reset the redux store when the component is unmounted
    return epub.state.resetStates;
  }, []);

  useEffect(() => {
    let stepVal = hash.replace('#', '');
    if (Constants.EPUB_STEPS.includes(stepVal)) {
      epub.state.setStep(stepVal);
    } else {
      epub.state.setStep(Constants.EPUB_STEP_SPLIT);
    }
  }, [hash]);

  useEffect(() => {
    // when language is changed, set up the epub data
    if (mediaId) {
      epub.ctrl.setupEPubGenWithMediaId(mediaId, language);
    }
  }, [mediaId, language]);

  useEffect(() => {
    // reset the chapters and related states 
    // when epubs loaded or currEPubIndex changed
    if (epubs.length > 0 && !error) {
      const chapters = epub.data.initEPubData(epubs[currEPubIndex], title);
      epub.ctrl.changeEPub(currEPubIndex, chapters);
    }
  }, [title, epubs, currEPubIndex]);

  return (
    <div id="ct-epb-con" />
  );
};

export default withReduxProvider(
  EPubGenerator,
  epubStore,
  connectWithRedux,
  [
    'error',
    'language',
    'rawEPubData',
    'epubs',
    'currEPubIndex'
  ],
  ['all']
);