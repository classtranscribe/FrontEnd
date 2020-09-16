import React, { useCallback } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

/**
 * An upload base component
 */
function UploadBase(props) {
  const {
    id,
    fluid,
    accept,
    children,
    disabled,
    onFileChange,
  } = props;

  const handleOnChange = ({ target: { files }}) => {
    if (typeof onFileChange === 'function') {
      onFileChange(files);
    }
  }

  const onDrop = useCallback(files => {
    if (typeof onFileChange === 'function') {
      onFileChange(files);
    }
  }, []);

  const uploadClasses = cx('ct-upload', 'base', { fluid });
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <div {...getRootProps()} className={uploadClasses} aria-label="browse files">
        <input
          {...getInputProps()}
          accept={accept}
          id={id}
          multiple
          type="file"
          onChange={handleOnChange}
          disabled={disabled}
        />
        {children(isDragActive)}
      </div>
    </>
  )
}

UploadBase.propTypes = {
  /** An unique id to the upload base */
  id: PropTypes.string.isRequired,

  /** Upload base can be fluid to its container */
  fluid: PropTypes.bool,

  /** File types to accept */
  accept: PropTypes.string,

  /** Disable the upload base */
  disabled: PropTypes.bool,

  /** Callback when file changed */
  onFileChange: PropTypes.func,

  /** The upload element */
  children: PropTypes.func,
};

export default UploadBase;

