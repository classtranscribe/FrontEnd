import React from 'react';
import { Button } from 'pico-ui';
import { LanguageMenuTrigger } from '../../LanguageMenuTrigger';
import EditorPicker from './EditorPicker';
import './index.scss';

import { epub } from 'screens/MediaSettings/Utils';


export default function Toolbar({
  chapter,
  language,
  txtEditor,
  setTxtEditor,
  adEditor=false,
  setADEditor,
}) {

  const noDescription = chapter.audioDescription.trim() === "";
  const editingTxt = txtEditor !== epub.EDITOR_DISPLAY;
  const openEditor = (txtEditor === epub.EDITOR_DISPLAY && (adEditor === epub.EDITOR_DISPLAY || adEditor === epub.EDITOR_NONE));
  const currEditor = editingTxt ? txtEditor : adEditor;
  const currSetEditor = editingTxt ? setTxtEditor : setADEditor;

  const parsedTxt = epub.parseText(chapter.text);
  const parsedAD = epub.parseText(chapter.audioDescription);

  const saveEditing = () => {
    currSetEditor(epub.EDITOR_DISPLAY);
    if (editingTxt) {
      epub.onSaveText(currEditor);
    } else {
      epub.onSaveAD(currEditor);
    }
  };
  
  const cancelEditing = () => {
    currSetEditor(epub.EDITOR_DISPLAY);
  };

  return (
    <div className="msp-ee-ep-tb ct-a-fade-in">
      <LanguageMenuTrigger
        language={language}
        classNames="ee-tb-btn"
      />

      <div className="ee-tb-btns">
        {
          openEditor
          ?
          <div className="ee-tb-edit-btns">
            {/* <EditorPicker description
              editor={adEditor}
              className="ee-tb-btn" 
              icon={noDescription ? "post_add" : "rate_review"}
              color="transparent"
              setEditor={setADEditor}
              text={noDescription ? 'Add Audio Description' : 'Edit Audio Description'}
              defaultEditor={parsedAD.editorType}
            /> */}
            <EditorPicker
              editor={txtEditor}
              className="ee-tb-btn" 
              icon="edit"
              color="transparent" 
              setEditor={setTxtEditor}
              text="Edit Content"
              defaultEditor={epub.EDITOR_MARKDOWN}
            />
          </div>
          :
          <div className="ee-tb-edit-btns editing ct-a-fade-in">
            <EditorPicker outlined 
              description={!editingTxt}
              className="ee-tb-btn epicker"
              editor={currEditor}
              setEditor={currSetEditor}
            />
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

        {
          openEditor
          &&
          <div className="w-100 ct-a-fade-in">
            <Button round
              classNames="ee-tb-btn ee-tb-btn-me" 
              color="black" 
              icon="settings"
              onClick={epub.startManagingEpubChapters}
            >
              Manage Chapters
            </Button>
            <Button round
              classNames="ee-tb-btn ee-tb-btn-me" 
              color="black" 
              icon="get_app"
              onClick={() => epub.download()}
            >
              Download ePub
            </Button>
          </div>
        }
      </div>
    </div>
  );
}
