import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import SettingsIcon from '@material-ui/icons/Settings';
import { CTFragment, CTHeading, CTText, useButtonStyles } from 'layout';
import { uurl, elem } from 'utils';
import { useEPubInfo, EPubInfoForm, ChapterImage } from '../../components';
import { epub } from '../../controllers';

function EPubInfo() {
  const btn = useButtonStyles();
  const epubInfo = useEPubInfo();
  const [editing, setEditing] = useState(false);

  const handleOnSave = () => setEditing(false);
  const handleEdit = () => {
    setEditing(true);
    elem.scrollToTop(epub.const.EPubChapterListID);
  }

  return editing ? (
    <CTFragment list padding={[20, 0, 20, 100]} className="ct-epb epb-info">
      <EPubInfoForm
        {...epubInfo} 
        onSave={handleOnSave} 
        onSaveButtonText="Done"
        withCover
      />
    </CTFragment>
  ) : (
    <CTFragment list padding={[0, 0, 10, 100]} className="ct-epb epb-info">
      <ChapterImage
        screenshots={epubInfo.screenshots} 
        image={uurl.getMediaUrl(epubInfo.cover.value)}
        promptText="Click to Choose cover image"
        onChooseImage={epubInfo.cover.setValue}
      />

      <CTHeading as="h1">{epubInfo.title.value}</CTHeading>

      <CTFragment hBetween padding={[10, 0, 0, 0]}>
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
