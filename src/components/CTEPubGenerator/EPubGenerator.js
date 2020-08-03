import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { CTLoader, altEl, makeEl } from 'layout';
import { connectWithRedux } from './redux';
import { epub, CTEPubData, CTEPubConstants as Constants } from './controllers';
import { PlayerModal } from './components';
import SplitChapters from './Step1-SplitChapters';
import EditChapters from './Step2-EditChapters';
import DowloadEPub from './Step3-DowloadEPub';
import './index.scss';

function EPubGeneratorWithRedux(props) {
  const {
    // props
    media,
    epubDataLike,
    // states
    rawEPubData,
    chapters,
    playerData
  } = props;
  
  const loading = epub.ctrl.isLoading(rawEPubData, chapters);

  useEffect(() => {
    epub.history.clear();
  }, []);

  useEffect(() => {
    // when language is changed, set up the epub data
    if (epubDataLike && epubDataLike.id) {
      epub.ctrl.setupEPubGenerator(epubDataLike);
    }
  }, [epubDataLike]);

  const splitChapterElement = altEl(SplitChapters, epub.ctrl.isStep1);
  const editChapterElement = altEl(EditChapters, epub.ctrl.isStep2);
  const downloadElement = altEl(DowloadEPub, epub.ctrl.isStep3);

  const playerProps = { ...playerData, open: Boolean(playerData), media };
  const playerModalElement = makeEl(PlayerModal, playerProps);

  return (
    <div id={Constants.EPubGeneratorContainerID} className="ct-epb epb-gen-con">
      {
        loading ? (
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

const EPubGenerator = connectWithRedux(
  EPubGeneratorWithRedux,
  ['rawEPubData', 'chapters', 'playerData']
);

EPubGenerator.propTypes = {
  media: PropTypes.object,
  epubDataLike: PropTypes.instanceOf(CTEPubData).isRequired
};

export default EPubGenerator;