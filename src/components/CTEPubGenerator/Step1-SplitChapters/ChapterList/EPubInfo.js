import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import SettingsIcon from '@material-ui/icons/Settings';
import { CTFragment, CTHeading, CTText, CTConfirmation, useButtonStyles } from 'layout';
import { uurl, elem } from 'utils';
import { useEPubInfo, EPubInfoForm, ChapterImage } from '../../components';
import { epub } from '../../controllers';

function EPubInfo() {
  const history = useHistory();
  const btn = useButtonStyles();
  const epubInfo = useEPubInfo();
  const [confirm, setConfirm] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleEdit = () => {
    setEditing(true);
    elem.scrollToTop(epub.const.EPubChapterListID);
  };
  const handleOnSave = () => {
    setEditing(false);
    elem.scrollToTop(epub.const.EPubChapterListID);
  };
  const handleDelete = () => setConfirm(true);
  const handleCloseConfirm = () => setConfirm(false);
  const handleConfirm = async () => {
    await epub.list.deleteEPub(epub.list.currEPub);
    history.replace(window.location.pathname);
  };

  return editing ? (
    <CTFragment dFlexCol padding={[20, 0, 20, 100]} className="ct-epb epb-info">
      <EPubInfoForm
        {...epubInfo} 
        onSave={handleOnSave} 
        onSaveButtonText="Done"
        onDelete={handleDelete}
      />
      <CTConfirmation
        open={confirm}
        title="Delete Confirmation"
        text="Are you sure to delete this ePub? (This action cannot be undone)"
        onClose={handleCloseConfirm}
        onConfirm={handleConfirm}
      />
    </CTFragment>
  ) : (
    <CTFragment dFlexCol padding={[0, 0, 10, 100]} className="ct-epb epb-info">
      <ChapterImage
        id="ct-epb-cover-img"
        image={epubInfo.cover.value}
        screenshots={epubInfo.screenshots}
        disableDescription
        onChooseImage={epubInfo.cover.setValue}
      />

      <CTHeading as="h1">{epubInfo.title.value}</CTHeading>

      <CTFragment justConBetween padding={[10, 0, 0, 0]}>
        <CTText>{epubInfo.author.value}</CTText>

        <Button 
          startIcon={<SettingsIcon />} 
          className={btn.tealLink}
          onClick={handleEdit}
        >
          Settings
        </Button>
      </CTFragment>
    </CTFragment>
  );
}

export default EPubInfo;
