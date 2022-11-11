import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { Popup } from 'semantic-ui-react';
import { elem } from 'utils/use-elem';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton, Button } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import autosize from 'autosize';
import { epub } from '../../controllers';
import { MDPreviewer, MDEditor } from '../Markdown';
import ChapterEditButton from '../ChapterEditButton';
import './index.scss';

function ChapterText({
  text = '',
  id = '',
  className,
  onSaveText,
  addNewText = 'Click to add content',
  attached,
  height = '300px'
}) {
  const [editing, setEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const startEditing = () => setEditing(true);
  const closeEditing = () => setEditing(false);

  const onSave = (newText) => {
    if (typeof onSaveText === 'function' && newText !== text) {
      onSaveText(newText);
    }
    closeEditing();
  };

  const isNotEmpty = Boolean(text.trim());

  useEffect(() => {
    if (editing) {
      setEditing(false);
    }
  }, [text]);

  useEffect(() => {
    if (editing) {
      elem.scrollIntoCenter(id);
      // epub.nav.disable(); NOT IMPLEMENTED
    } else {
      // epub.nav.enable(); NOT IMPLEMENTED
    }
  }, [editing]);

  const txtConClasses = cx('ct-epb', 'ch-text-con', className, { attached });

  const handleDeleteText = () => {
    setDialogOpen(true);
  };

  const handleNo = () => {
    setDialogOpen(false);
  };

  const handleYes = () => {
    onSave("");
    setDialogOpen(false);
  };

  const deleteButton = text !== "" ? (
    <div>
      <div style={{float: 'right'}}>
        <IconButton
          aria-label="delete"
          onClick={handleDeleteText}
        >
          <Delete />
        </IconButton>
      </div>
      <Dialog
        open={dialogOpen}
        onClose={handleNo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Text Block
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to delete the Text Block?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNo} autoFocus>NO</Button>
          <Button onClick={handleYes}>YES</Button>
        </DialogActions>
      </Dialog> 
    </div>
  ) : null;



  return (
    <div id={id} className={txtConClasses}>
      {editing ? (
        <div className="w-100 mb-4">
          <MDEditor
            height={height}
            id={`md-editor-${id}`}
            defaultValue={text}
            onSave={onSave}
            onClose={closeEditing}
            attached={attached}
          />
        </div>
      ) : (
        <div>
          {deleteButton}
          <Popup
            inverted
            basic
            openOnTriggerFocus
            openOnTriggerClick={false}
            openOnTriggerMouseEnter
            closeOnTriggerMouseLeave
            closeOnTriggerBlur
            content="Click to edit"
            position="top center"
            disabled={!isNotEmpty}
            trigger={
              <ChapterEditButton 
                onClick={startEditing} 
                muted={!isNotEmpty} 
                attached={attached}
                data-empty={isNotEmpty}
              >
                {isNotEmpty ? <MDPreviewer value={text} /> : addNewText}
              </ChapterEditButton>
            }
          />
        </div>
      )}
    </div>
  );
}

export default ChapterText;