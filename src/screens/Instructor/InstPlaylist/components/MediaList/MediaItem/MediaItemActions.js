import React from 'react';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import { links } from 'utils';
import { useStyles } from 'screens/Course/Components/CourseInfo/ActionButtons/CourseAnalyticsButton';
import { mediaControl } from '../../../controllers';

function MediaItemActions({
  mediaId
}) {
  const buttonClasses = useStyles();
  const btnClassName = cx(buttonClasses.button, 'media-item-button');

  const handleDelete = () => {
    mediaControl.confirmDeleteMedia(mediaId);
  };

  return (
    <div className="media-item-actions">
      <Button 
        className={btnClassName}
        startIcon={<i className="material-icons watch">play_circle_filled</i>}
        href={links.watch(mediaId)}
      >
        Watch
      </Button>

      <Button 
        className={btnClassName}
        startIcon={<i className="material-icons">text_snippet</i>}
        href={links.mspTransSettings(mediaId)}
      >
        Transcription
      </Button>

      <Button 
        className={btnClassName}
        startIcon={<i className="material-icons">import_contacts</i>}
        href={links.mspEpubSettings(mediaId)}
      >
        ePub
      </Button>

      <Button 
        className={btnClassName}
        startIcon={<i className="material-icons delete">delete</i>}
        onClick={handleDelete}
      >
        delete
      </Button>
    </div>
  );
}

export default MediaItemActions;
