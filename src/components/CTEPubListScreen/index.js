import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ARRAY_INIT } from 'utils/constants';
import { CTFragment, altEl, makeEl } from 'layout';
import SourceTypes from 'entities/SourceTypes';
import { EPubPoster, EPubList, NewEPubModal } from './components';
import { EPubListCtrl } from './controllers';

function CTEPubListScreen(props) {
  const { sourceType, sourceId, source, defaultTitle } = props;

  const [ePubs, setEPubs] = useState(ARRAY_INIT);
  const [rawEPubData, setRawEPubData] = useState(ARRAY_INIT);
  const [sourceData, setSourceData] = useState(source);
  const [languages, setLanguages] = useState(ARRAY_INIT);
  const [openNewEPubModal, setOpenNewEPubModal] = useState(false);

  const loading = rawEPubData === ARRAY_INIT 
                || ePubs === ARRAY_INIT
                || languages === ARRAY_INIT;

  const setupEPubsData = async () => {
    if (!sourceType || !sourceId) return;

    const data = await EPubListCtrl.setupEPubsData(sourceType, sourceId, source);
    setEPubs(data.ePubs);
    setSourceData(data.source);
    setLanguages(data.languages);
    setRawEPubData(data.rawEPubData);
  };

  useEffect(() => {
    window.onfocus = setupEPubsData;
    setupEPubsData();

    return () => { window.onfocus = null; };
  }, [sourceType, sourceId, source]);

  const handleCreateEPub = async ({ title, language }) => {
    await EPubListCtrl.createEPub(sourceType, sourceId, {
      language, title, filename: title
    });
    await setupEPubsData();
  };

  const posterElement = makeEl(EPubPoster);
  const listElement = altEl(EPubList, !loading, {
    ePubs, languages, rawEPubData,
    sourceType, sourceId, sourceData,
    onCreate: () => setOpenNewEPubModal(true)
  });
  const newEPubModalElement = makeEl(NewEPubModal, {
    open: openNewEPubModal,
    languages,
    defaultTitle,
    onClose: () => setOpenNewEPubModal(false),
    onCreate: handleCreateEPub
  });

  return (
    <CTFragment
      h100
      dFlex
      minWidth="1200px"
      overflowHidden
      id="ct-epub-list-screen-con"
      loading={loading}
    >
      {posterElement}
      {listElement}
      {newEPubModalElement}
    </CTFragment>
  );
}

CTEPubListScreen.propTypes = {
  /** Source type for the ePubs, Media - `2` */
  sourceType: PropTypes.oneOf([
    SourceTypes.Media,
    SourceTypes.Playlist
  ]).isRequired,

  /** The sourceId for the ePubs */
  sourceId: PropTypes.string.isRequired,

  /** The source data for the ePubs */
  source: PropTypes.any,

  /** Default title */
  defaultTitle: PropTypes.string.isRequired
};

export default CTEPubListScreen;

