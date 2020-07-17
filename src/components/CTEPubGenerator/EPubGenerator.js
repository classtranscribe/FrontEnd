import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLoader } from 'layout';
import { epubStore, connectWithRedux } from './redux';
import { epub, CTEPubConstants as Constants } from './controllers';
import SplitChapter from './Step1-SplitChapters';
import './index.scss';

function EPubGenerator(props) {
  const {
    mediaId,
    title,
    // states
    error,
    language,
    rawEPubData,
    chapters,
    epubs,
    currEPubIndex
  } = props;
  const { hash } = useLocation();
  const loading = epub.ctrl.isLoading(chapters);

  useEffect(() => {
    // register redux dispatch functions
    epub.state.init(props);
    // reset the redux store when the component is unmounted
    // return epub.state.resetStates;
  }, []);

  useEffect(() => {
    let stepVal = hash.replace('#', '');
    if (Constants.EPubSteps.includes(stepVal)) {
      epub.state.setStep(stepVal);
    } else {
      epub.state.setStep(Constants.EPubStepSplitChapters);
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
      const newChapters = epub.data.initEPubData(epubs[currEPubIndex], title);
      epub.ctrl.changeEPub(currEPubIndex, newChapters);
    }
  }, [title, epubs, currEPubIndex]);

  return (
    <div id={Constants.EPubGeneratorContainerID} className="ct-epb epb-gen-con">
      {
        loading ? (
          <div className="w-100"><CTLoader /></div>
        ) : (
          <>
            <SplitChapter />
          </>
        )
      }
    </div>
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
    'chapters',
    'currEPubIndex'
  ],
  ['all']
);