import React, {useState} from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';
import { ButtonBase, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton} from '@material-ui/core';
import { CTFragment, CTText, CTCheckbox, CTPopoverLabel, CTInput } from 'layout';
import { Button } from 'pico-ui';
import { prompt } from 'utils';

function EPubCTListItem(props) {
  const {
    id,
    link,
    to,
    icon,
    title,
    description,
    role = 'listitem',
    className,
    titleSize = 'medium',
    despSize,
    titleProps,
    despProps,
    children,
    onDelete,
    onRename,
    enableButtons,
    isSelected,
    handleSelect,
    ...baseProps
  } = props;

  const baseClasses = cx('ct-listitem', className);
  const titleClasses = cx('ct-listitem-title', titleProps ? titleProps.className : null);
  const selected = enableButtons ? isSelected(id) : false;
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(title);

  const stopPropagation = (event) => {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
  };

  const preventDefault = (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
  };

  const handleDeleteEPub = (event) => {
     setOpen(true);
     event.preventDefault();
  };
  const handleYes = () => {
    onDelete(id);
    setOpen(false);
  };
  const handleNo = () => {
    prompt.addOne({ text: 'Deleting canceled', timeout: 1000 });
    setOpen(false);
  };

  const handleCheck = (event) => {
    stopPropagation(event);
    handleSelect(id, event.target.checked);
  };

  const handleRename = (event) => {
    setEditing(false);
    preventDefault(event);
    if (inputValue && inputValue !== title) {
      onRename(inputValue, id);
    }
  };

  const handleEdit = (event) => {
    setEditing(true);
    setInputValue(title);
    preventDefault(event);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const renameBtnIcon = editing ? 'check' : 'edit';
  const renameBtnLabel = editing ? 'Save' : 'Rename';
  const renameBtnClick = editing ? handleRename : handleEdit;

  // for link item
  if (link) {
    baseProps.component = Link;
    baseProps.to = to;
  }

  const checkBoxClasses = CTCheckbox.useStyles();

  const renameButton = (enableButtons ? (
    <CTPopoverLabel label={renameBtnLabel}>
      <IconButton
        size="small"
        className="ml-4"
        onClick={renameBtnClick}
        aria-label={renameBtnLabel}
        onMouseDown={(e) => stopPropagation(e)}
      >
        <i className="material-icons rename-icon">{renameBtnIcon}</i>
      </IconButton>
    </CTPopoverLabel>
  ): null);

  const checkBox = (enableButtons ? (
    <Checkbox
      classes={checkBoxClasses}
      onClick={stopPropagation}
      checked={selected}
      onChange={handleCheck}
      onMouseDown={(e) => stopPropagation(e)}
    />
  ) : null);

  const deleteButton = (enableButtons ? (
    <Button
      id={id} 
      lowercase
      icon="delete"
      color="red transparent"
      classNames="mr-2"
      onClick={handleDeleteEPub}
    />
  ) : null);

  const dialogue = (enableButtons ? (
    <Dialog
      open={open}
      onClose={handleNo}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Delete an I•Note
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Do you want to delete the I•Note for {title}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleNo} autoFocus>NO</Button>
        <Button onClick={handleYes}>YES</Button>
      </DialogActions>
    </Dialog>
  ) : null);


  return (
    <ButtonBase
      id={id} 
      role={role} 
      title={title}
      className="ct-listitem-con"
      {...baseProps}
    >
      {checkBox}

      <CTFragment dFlex alignItCenter className={baseClasses}>
        {icon && <span aria-hidden="true" className="material-icons">{icon}</span>}
        <CTFragment dFlexCol className="ct-listitem-text">
          {editing ? 
            <CTInput
              label="Video Name"
              placeholder={title}
              value={inputValue}
              onChange={handleInputChange}
              onMouseDown={(e) => stopPropagation(e)}
              onReturn={handleRename}
              onFocus={(e) => preventDefault(e)}
              onClick={(e) => preventDefault(e)}
              className="ml-3"
              autoFocus
            /> : 
            <CTText
              bold
              size={titleSize}
              margin={[0, 0, 5, 0]}
              line={1}
              {...titleProps}
              className={titleClasses}
            >
              {inputValue || children}
              {/* {title || children} */}
            </CTText>}
          {description && <CTText size={despSize} {...despProps}>{description}</CTText>}
        </CTFragment>
      </CTFragment>
      {renameButton}
      {/* {deleteButton} */}
      {dialogue}
    </ButtonBase>
  );
}

EPubCTListItem.propTypes = {
  /** An unique id */
  id: PropTypes.string,

  /** material-icon name */
  icon: PropTypes.string,

  /** Title of the listitem */
  title: PropTypes.string,

  /** Title of the listitem */
  children: PropTypes.node,

  /** Description of the listitem */
  description: PropTypes.string,

  /** True if serve as a <a> tag */
  link: PropTypes.bool,

  /** react-router-dom `Link` props */
  to: PropTypes.any,

  /** default as `listitem` */
  role: PropTypes.string,

  /** Addtional classes */
  className: PropTypes.string,

  /** Title's size, default as medium */
  titleSize: CTText.propTypes.size,

  /** Description's size, default as normal */
  despSize: CTText.propTypes.size,

  /** CTText props to title */
  titleProps: PropTypes.shape(CTText.propTypes),

  /** CTText props to description */
  despProps: PropTypes.shape(CTText.propTypes),

  onDelete: PropTypes.func,

  enableButtons: PropTypes.bool,

  isSelected: PropTypes.func,

  handleSelect: PropTypes.func,

  onRename: PropTypes.func
};

export default EPubCTListItem;

