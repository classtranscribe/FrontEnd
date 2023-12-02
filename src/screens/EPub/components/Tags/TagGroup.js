import React, { useState, useRef } from "react";
import { CTFragment, CTDropdown } from "layout";
import { SelectCtrlButton } from 'components';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import './TagGroup.scss';


function TagGroup({
    chapters,
    selectedChapters,
    setSelectedChapters,
    dispatch
  }) {
    const [openDropdown, setOpenDropdown] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [newTag, setNewTag] = useState("");
    let tagsObject = null;
    const anchorRef = useRef(null);

    // unused const handleOpenDropdown = () => {
    //     setOpenDropdown(true);
    // };
    const handleCloseDropdown = () => {
        setOpenDropdown(false);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewTag("");
    }

    const handleRemoveAll = () => {
      setSelectedChapters([]);
    }
    const handleSelectAll = () => {
      setSelectedChapters(chapters.map((ch, idx) => idx));
    };

    const getTagsList = () => {
      let tagsSet = new Set();
      let tagsObj = {};
      chapters.forEach((chapter) => {
        chapter.condition.forEach((tag) => {
          tagsSet.add(tag);
        })
      });
    
      chapters.forEach((chapter, idx) => {
        Array.from(tagsSet).forEach((tag) => {
          let obj = {};
          obj.value = tag;
          obj.text = tag;
          obj.icon = "e";
          if (tag in tagsObj) {
            if (selectedChapters.includes(idx) && !chapters[idx].condition.includes(tag)) {
              tagsObj[tag].icon = "e";
            }
          } else {
            tagsObj[tag] = obj;
              if (selectedChapters.includes(idx) && chapters[idx].condition.includes(tag)) {
                tagsObj[tag].icon = "check";
              } 
          }
        });
      });
      tagsObject = tagsObj;
      let add_obj = {};
      add_obj.value = "add";
      add_obj.text = "Add a tag";
      add_obj.icon = "add";
      return [add_obj, ...Object.values(tagsObj)];
    };
    
    const handleChange = (value) => {
      if (!value) {
        return;
      }
      if (value === "add") {
        handleOpenDialog();
        return;
      }
      const removeTags = tagsObject[value].icon === "check";
      selectedChapters.forEach((ch) => {
        let toDispatch = false;
        let tags = chapters[ch].condition;
        if (removeTags && tags.includes(value)) {
          tags = tags.filter((tag) => tag !== value);
          toDispatch = true;
        } else if (!removeTags && !tags.includes(value)) {
          tags = [...tags, value];
          toDispatch = true;
        }
        if (toDispatch) {
          dispatch({
            type: 'epub/updateEpubData', payload: {
              action: 'setChapterContentAtChapterIdx', payload: { contentIdx: 0, chapterIdx: ch, value: tags, type: 'condition' }
            }
          });
        }
      });
    };

    const handleAddNewTag = () => {
        selectedChapters.forEach((ch) => {
            let tags = chapters[ch].condition;
            tags = [...tags, newTag];
            dispatch({
                type: 'epub/updateEpubData', payload: {
                  action: 'setChapterContentAtChapterIdx', payload: { contentIdx: 0, chapterIdx: ch, value: tags, type: 'condition' }
                }
              });
        });
        handleCloseDialog();
    }
  
    return (
      <CTFragment>
        {selectedChapters.length !== 0 &&
        <CTFragment className='tagGroup'>
          <SelectCtrlButton
            selecting={selectedChapters.length > 0}
            isSelectedAll={selectedChapters.length === chapters.length}
            selectAll={() => handleSelectAll()}
            removeAll={() => handleRemoveAll()}
          />
          <Button 
            className='ct-epb-dropdown-button'
            variant="contained" 
            endIcon={<ArrowDropDown />}
            onClick={setOpenDropdown}
            ref={anchorRef}
          >Add/Remove Tags
          </Button>
          <CTDropdown
            id="ct-epub-tag-dropdown"
            options={getTagsList()}
            open={openDropdown}
            anchorRef={anchorRef}
            onClose={handleCloseDropdown}
            onChange={handleChange}
          />
        </CTFragment>}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Add a Tag</DialogTitle>
          <DialogContent>
            <DialogContentText className="ct-epub-tag-dialog">
              Enter a new tag below.      
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="New Tag"
              fullWidth
              variant="standard"
              onChange={(e) => {setNewTag(e.target.value)}}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleAddNewTag}>Add Tag</Button>
          </DialogActions>
        </Dialog>
      </CTFragment>
    );
  }
  
  export default TagGroup;