/* eslint-disable no-console */
import { React , useRef} from 'react';
import { connectWithRedux } from '../../../Utils';

function TranscriptionMenu({ media, currentTranscriptionMulti= {}, onClose = null, dispatch }) {
  const { transcriptions = [] } = media;
  const { transKeysSelected = [] } = currentTranscriptionMulti;
  const timeout = useRef(null);
  // create new sorted version with half-good keys. ideally these would be unique
  // and would be useful across different videos with different transcription labels 
  const transcriptionOptions = [...transcriptions]
  // now transKey are defined, can decide if the item is active (i.e. selected)
  transcriptionOptions.forEach(t => (t.active = transKeysSelected.includes(t.transKey)))

  // eslint-disable-next-line no-console
  // console.log(transcriptionOptions)
  
  const toggleChooseTranscription= (transKey, active) => () => {
    dispatch({ type: 'watch/setCurrentTranscriptionMulti', payload: {transKey, active} });
    if (timeout.current) clearTimeout(timeout.current);
    // Add a 3 second delay before it automatically closes; 
    // makes it easy to select/deselect additional transcriptions
    timeout.current = setTimeout(() => onClose(), 3000);
  };

  return (
    <div
      id="watch-transcription-menu"
      role="menu"
      aria-label="Transcription Menu"
      className="watch-general-menu"
    >
      <button
        className="plain-btn watch-menu-close-btn watch-screenmode-menu-close-btn"
        onClick={onClose}
      >
        <i className="material-icons">close</i>
      </button>

      <div className="watch-icon-list">
        {transcriptionOptions.map((t) => (
          
          <button
            key={`transcription-menu-item-${t.id}`}
            className="plain-btn watch-icon-listitem"
            aria-label={t.publicLabel}
            // active={Boolean(t.active).toString()}
            onClick={toggleChooseTranscription(t.transKey, ! t.active)}
            role="menuitem"
          >
            <span tabIndex="-1">
              <div className="watch-icon-listitem-checkmark">
                {t.active && <i className="material-icons">check</i>}
              </div>
              <i className="material-icons watch-icon-icon">{ t.transcriptionType === 1 ? "description" : "closed_caption"}</i>
              <div className="watch-icon-name">{t.publicLabel}</div>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default connectWithRedux(TranscriptionMenu, ['media', 'currentTranscriptionMulti']);
