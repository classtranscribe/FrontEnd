import React, { useState } from 'react';
import {Button} from 'pico-ui'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { prompt } from 'utils';
import ErrorTypes from 'entities/ErrorTypes';
import { links } from 'utils/links';
import { altEl, makeEl, CTFragment, CTHeading, CTText, CTList } from 'layout';
import { SelectCtrlButton } from 'components/SelectCtrlButton';
import { LanguageConstants } from '../../CTPlayer';
import { NoEPubWrapper, NoLangWrapper } from './Wrappers';
import NewEPubButton from './NewEPubButton';
import EPubCTList from './EPubCTList/EPubCTList';



export function _getEPubListItems(ePubs, onDelete, onRename, isSelected, handleSelect) { 
  if (ePubs.length > 0) { 
    return ePubs.map(epub => {
      let lang = LanguageConstants.decode(epub.language);
      // let status = epub.isPublished ? 'Published' : 'Unpublished'
      return {
        id: epub.id,
        title: epub.title,
        icon: 'text_snippet',
        description: `${lang}`,
        link: true,
        to: links.epub(epub.id),
        target: '_blank',
        titleProps: {
          celadon: true
        },
        onDelete: onDelete(epub.id),
        onRename: onRename(epub.id, epub.title),
        enableButtons: true,
        isSelected: isSelected(epub.id),
        handleSelect: handleSelect(epub.id)
      }
    });
  }
}

function EPubList(props) {
  const {
    ePubs, languages, rawEPubData,
    sourceType, sourceId,
    onCreate,
    onDelete,
    onRename,
    isSelected,
    isSelectedAll,
    handleSelect,
    handleSelectAll,
    handleRemoveAll,
    epubsSelected,
    deleteSelected
  } = props;

  const noLang = languages.length === 0;
  const noEPub = !noLang && rawEPubData === ErrorTypes.NotFound404;
  const notFoundEPub = ePubs === ErrorTypes.NotFound404;
  const hasError = noLang || noEPub;
  const hasEPubs = !hasError && !notFoundEPub && ePubs.length > 0;

  const noLangElement = altEl(NoLangWrapper, noLang);
  const noEPubElement = altEl(NoEPubWrapper, noEPub, { sourceType, sourceId });
  const newEPubBtnElement = makeEl(NewEPubButton, { onCreate });
  const newEPubListItems = makeEl(<EPubCTList items={_getEPubListItems(ePubs, onDelete, onRename, isSelected, handleSelect, epubsSelected)} />);

  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    setOpen(true);
  };
  const handleYes = () => {
    deleteSelected();
    setOpen(false);
  };
  const handleNo = () => {
    prompt.addOne({ text: 'Deleting canceled', timeout: 1000 });
    setOpen(false);
  };

  const deleteDialogue = (
    <Dialog
      open={open}
      onClose={handleNo}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Delete I•Note{(epubsSelected !== 1) ? 's' : ''}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Do you want to delete {epubsSelected} I•Note{(epubsSelected !== 1) ? 's' : ''}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleNo} autoFocus>NO</Button>
        <Button onClick={handleYes}>YES</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <CTFragment h100 scrollY padding={[40, 0]} id="ct-epb-list">
      {noLangElement}
      {noEPubElement}

      {
        !hasError
        &&
        <CTFragment>
          {hasEPubs ? (
            <>
              <CTFragment justConBetween padding={[0, 20, 20, 30]}>
                <SelectCtrlButton
                  selecting={epubsSelected > 0}
                  isSelectedAll={isSelectedAll}
                  selectAll={handleSelectAll()}
                  removeAll={handleRemoveAll()}
                />
                {(epubsSelected > 0) && 
                  <Button
                    lowercase
                    icon="delete"
                    color="red transparent"
                    text="Delete"
                    classNames="mr-2"
                    onClick={handleDelete}
                  /> }
                {deleteDialogue}
                <CTHeading as="h3" alignItCenter compact icon="library_books">
                  I-Note Books
                </CTHeading>
                {newEPubBtnElement}
              </CTFragment>

              <CTFragment justConBetween padding={[0, 20, 20, 30]}>
                {newEPubListItems}
              </CTFragment>
            </>
          ) : (
            <CTFragment margin={[50, 0, 0, 0]} dFlexCol center>
              {newEPubBtnElement}
              <CTText center muted padding="10">
                Create your first I-Note book
              </CTText>
            </CTFragment>
          )}
        </CTFragment>
      }
    </CTFragment>
  );
}

export default EPubList;
