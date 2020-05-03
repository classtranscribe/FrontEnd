import React from 'react';
import { Button } from 'pico-ui';
import EditorPicker from './EditorPicker';
import './index.scss';

import { epub, connectWithRedux } from 'screens/MediaSettings/Utils/epub';


function Toolbar({
  txtEditor,
  setTxtEditor,
}) {
  const openEditor = txtEditor === epub.EDITOR_DISPLAY;

  const saveEditing = () => {
    setTxtEditor(epub.EDITOR_DISPLAY);
    epub.onSaveText(txtEditor);
  };
  
  const cancelEditing = () => {
    setTxtEditor(epub.EDITOR_DISPLAY);
  };

  return (
    <div className="msp-ee-ep-tb ct-a-fade-in">
      <div className="ee-tb-btns top">
        {
          openEditor
          ?
          <div className="w-100 ct-a-fade-in">
            <Button round
              classNames="ee-tb-btn ee-tb-btn-me" 
              color="black" 
              icon="settings"
              onClick={epub.startManagingEpubChapters}
            >
              Manage Chapters
            </Button>
          </div>
          :
          <div className="w-100 ct-a-fade-in">
            <Button round
              classNames="ee-tb-btn ee-tb-btn-me" 
              color="teal" 
              icon="check"
              onClick={saveEditing}
            >
              Save Changes
            </Button>
            <Button round
              classNames="ee-tb-btn ee-tb-btn-me" 
              color="black" 
              icon="delete"
              onClick={cancelEditing}
            >
              Discard Changes
            </Button>
          </div>
        }
      </div>

      {
          openEditor
          &&
          <div className="ee-tb-edit-btns">
            <EditorPicker
              editor={txtEditor}
              className="ee-tb-btn" 
              icon="edit"
              color="transparent" 
              setEditor={setTxtEditor}
              text="Edit Content"
              defaultEditor={epub.EDITOR_MARKDOWN}
            />

            <Button
              classNames="ee-tb-btn ee-tb-btn-me" 
              color="transparent" 
              icon="get_app"
              onClick={() => epub.download()}
            >
              Download ePub
            </Button>
          </div>
        }
    </div>
  );
}

export default connectWithRedux(
  Toolbar,
  [
    'txtEditor',
  ],
  [
    'setTxtEditor'
  ]
)