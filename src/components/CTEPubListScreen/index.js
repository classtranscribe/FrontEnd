import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { prompt } from 'utils';
import { ARRAY_INIT } from 'utils/constants';
import { CTFragment, altEl, makeEl } from 'layout';
import SourceTypes from 'entities/SourceTypes';
import { EPubPoster, EPubList, NewEPubModal } from './components';
import { EPubListCtrl } from './controllers';
import {_generateDefaultEpubName } from './controllers/helpers';

function CTEPubListScreen(props) {
  const [selectedEpubs, setSelectedEpubs] = useState([]);
  const { sourceType, sourceId, source} = props;
  const [ePubs, setEPubs] = useState(ARRAY_INIT);
  const [rawEPubData, setRawEPubData] = useState(ARRAY_INIT);
  const [sourceData, setSourceData] = useState(source);
  const [languages, setLanguages] = useState(ARRAY_INIT);
  const [openNewEPubModal, setOpenNewEPubModal] = useState(false);
  const [defaultTitle, setDefaultTitle] = useState(""); 
  const loading = rawEPubData === ARRAY_INIT 
                || ePubs === ARRAY_INIT
                || languages === ARRAY_INIT
                || defaultTitle === ""; // TODO should defaultTitle be in loading 
  
  const setupEPubsData = async () => {
    if (!sourceType || !sourceId) return;

    const data = await EPubListCtrl.setupEPubsData(sourceType, sourceId, source);
    setEPubs(data.ePubs);
    setSourceData(data.source);
    setLanguages(data.languages);
    setRawEPubData(data.rawEPubData);
    const newTitle = await _generateDefaultEpubName(data.ePubs, props.defaultTitle);
    setDefaultTitle(newTitle);
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

  // Delete an I•Note by epubId
  const handleDeleteEPub = async (epubId) => {
    try {
      prompt.addOne({ text: 'Deleting the I•Note...' , timeout: 4000 });
      await EPubListCtrl.deleteEPub(epubId);
    }
    catch(e) {
      prompt.addOne({ text: 'Cannot delete the I•Note...' , timeout: 4000 });
    }
    await setupEPubsData();
  };

  let epubsSelected = selectedEpubs.length;

  const deleteSelected = async () => {
    let success = true
    let count = selectedEpubs.length;
    while (selectedEpubs.length > 0) {
      try {
        await EPubListCtrl.deleteEPub(selectedEpubs[selectedEpubs.length - 1]);
      }
      catch(e) {
        success = false
        prompt.addOne({ text: 'Cannot delete the I•Note...' , timeout: 4000 })
      }
      selectedEpubs.pop();
    }
    epubsSelected = 0;
    if (success) {
      prompt.addOne({text: `Deleting ${count} I•Note${count !== 1 ? 's' : ''}...`, timeout: 4000});
    }
    await setupEPubsData();
  }

  const handleSelect = (epubId, checked) => {
    if (checked) {
      setSelectedEpubs([...selectedEpubs, epubId]);
    } else {
      setSelectedEpubs(selectedEpubs.filter(e => e !== epubId));
    }
  };

  const isSelected = useCallback((epubId) => {
    return selectedEpubs.includes(epubId);
  }, [selectedEpubs]);

  const isSelectedAll = ePubs.length === selectedEpubs.length;

  const handleSelectAll = () => {
    setSelectedEpubs(ePubs.map((e) => e.id));
  }

  const handleRemoveAll = () => {
    setSelectedEpubs([]);
  }

  // Rename an EPub
  const handleRenameEPub = async (title, epubId) => {
    try {
      await EPubListCtrl.renameEpub(epubId, title);
    }
    catch(e) {
      prompt.addOne({text: 'Cannot rename the I•Note...', timeout: 4000});
    }
    await setupEPubsData();
  };

  const posterElement = makeEl(EPubPoster);
  const listElement = altEl(EPubList, !loading, {
    ePubs, languages, rawEPubData,
    sourceType, sourceId, sourceData,
    onCreate: () => setOpenNewEPubModal(true),
    onDelete: () => handleDeleteEPub,
    onRename: () => handleRenameEPub,
    handleSelect: () => handleSelect,
    isSelected: () => isSelected,
    isSelectedAll,
    handleSelectAll: () => handleSelectAll,
    handleRemoveAll: () => handleRemoveAll,
    epubsSelected,
    deleteSelected
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

