import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';
import { ButtonBase, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core'; // Jiaxi
import { CTFragment, CTText } from 'layout';
import { Button } from 'pico-ui'; // Jiaxi
import { prompt } from 'utils'; // Jiaxi

function CTListItem(props) {
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
    ...baseProps
  } = props;

  const baseClasses = cx('ct-listitem', className);
  const titleClasses = cx('ct-listitem-title', titleProps ? titleProps.className : null);

  // Jiaxi
  const [open, setOpen] = React.useState(false);
  const handleDeleteEPub = () => {
     setOpen(true);
  };
  const handleYes = () => {
    onDelete(id);
    setOpen(false);
  };
  const handleNo = () => {
    prompt.addOne({ text: 'Deleting canceled', timeout: 1000 });
    setOpen(false);
  };

  // for link item
  if (link) {
    baseProps.component = Link;
    baseProps.to = to;
  }

  // Jiaxi
  return (
    <ButtonGroup variant="contained" aria-label="outlined primary button group">
      <Button
        id={id} 
        lowercase
        icon="delete"
        color="red transparent"
        classNames="mr-2"
        onClick={handleDeleteEPub}
      />

      <Dialog
        open={open}
        onClose={handleNo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete alert"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to delete the iNote for {title}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNo} autoFocus >NO</Button>
          <Button onClick={handleYes} >YES </Button>
        </DialogActions>
      </Dialog>

      <ButtonBase
        id={id} 
        role={role} 
        title={title}
        // onClick={onClick} // Jiaxi
        className="ct-listitem-con"
        {...baseProps}
      >
        <CTFragment dFlex alignItCenter className={baseClasses}>
          {icon && <span aria-hidden="true" className="material-icons">{icon}</span>}
          <CTFragment dFlexCol className="ct-listitem-text">
            <CTText
              bold
              size={titleSize}
              margin={[0, 0, 5, 0]}
              line={1}
              {...titleProps}
              className={titleClasses}
            >
              {title || children}
            </CTText>
            {description && <CTText size={despSize} {...despProps}>{description}</CTText>}
          </CTFragment>
        </CTFragment>
      </ButtonBase>
    </ButtonGroup>
  );
}

CTListItem.propTypes = {
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

  onDelete: PropTypes.func
};

export default CTListItem;

