import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLoader, altEl, makeEl } from 'layout';
import { epubStore, connectWithRedux } from './redux';
import { epub, CTEPubConstants as Constants } from './controllers';
import { NoEPubWrapper, PlayerModal } from './components';
import SplitChapters from './Step1-SplitChapters';
import EditChapters from './Step2-EditChapters';
import DowloadEPub from './Step3-DowloadEPub';
import './index.scss';

function EPubGenerator(props) {
  const {
    mediaId,
    title,
    error,
    step,
    language,
    // rawEPubData,
    chapters,
    epubs,
    currEPubIndex,
    playerData
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

  const splitChapterElement = altEl(SplitChapters, step === Constants.EPubStepSplitChapters);
  const editChapterElement = altEl(EditChapters, step === Constants.EPubStepEditChapters);
  const downloadElement = altEl(DowloadEPub, step === Constants.EPubStepDownload);

  const playerProps = { ...playerData, open: Boolean(playerData), mediaId };
  const playerModalElement = makeEl(PlayerModal, playerProps);

  return (
    <div id={Constants.EPubGeneratorContainerID} className="ct-epb epb-gen-con">
      {
        error ? (
          <NoEPubWrapper mediaId={mediaId} error={error} />
        ) : loading ? (
          <div className="w-100"><CTLoader /></div>
        ) : (
          <>
            {splitChapterElement}
            {editChapterElement}
            {downloadElement}
            {playerModalElement}
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
    'step',
    'language',
    'rawEPubData',
    'epubs',
    'chapters',
    'currEPubIndex',
    'playerData'
  ],
  ['all']
);