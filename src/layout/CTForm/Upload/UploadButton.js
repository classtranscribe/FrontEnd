import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { CTText } from '../../CTText';
import UploadBase from './UploadBase';

const useStyles = makeStyles({
  root: {
    borderWidth: 2,
    borderColor: 'grey',
    borderStyle: 'dashed',
    width: '100%',
  }
});

/**
 * An upload button component
 */
function UploadButton(props) {
  const {
    icon = 'cloud_upload',
    text = 'Browse Files',
    children,
    ...baseProps
  } = props;

  const classes = useStyles();

  const startIconElem = <i className="material-icons">{icon}</i>;
  const dropIconElem = <i className="material-icons">cloud_download</i>;

  return (
    <UploadBase {...baseProps}>
      {(isDragActive) => (
        <Button
          startIcon={isDragActive ? dropIconElem : startIconElem}
          className={classes.root} 
          component="span"
        >
          <CTText bold>
            {isDragActive ? 'Drop your files here' : (children || text)}
          </CTText>
        </Button>
      )}
    </UploadBase>
  );
}

UploadButton.propTypes = {
  /** Icon for the upload button */
  icon: PropTypes.string,
  /** Text for the upload button */
  text: PropTypes.string,

  /** Content for the upload button */
  children: PropTypes.node,

  ...UploadBase.propTypes
}

export default UploadButton

