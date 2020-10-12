import React, { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { useButtonStyles, CTPopoverLabel } from 'layout';
import { _copyTextToClipboard, prompt } from 'utils';

function CopyButton(props) {
  const {
    icon = 'insert_link',
    className,
    text,
    children,
    onCopied,
    onError,
    label,
    ...btnProps
  } = props;

  const btnStyles = useButtonStyles();
  const [copyStatus, setCopyStatus] = useState(0);

  const handleCopy = async () => {
    const successed = await _copyTextToClipboard(text);
    if (successed) {
      setCopyStatus(1);
      setTimeout(() => setCopyStatus(0), 3000);
      if (typeof onCopied === 'function') onCopied();
      if (!children) {
        prompt.addOne({ text: 'Copied!', timeout: 4000 });
      }
    } else {
      onError();
      if (typeof onError === 'function') onError();
    }
  };

  const copied = copyStatus > 0;
  const copyIcon = <span className="material-icons">{copied ? 'check' : icon}</span>;

  const commonProps = {
    className: cx(btnStyles.tealLink, className),
    onClick: handleCopy,
    ...btnProps
  };

  return children ? (
    <Button
      startIcon={copyIcon}
      onClick={handleCopy}
      {...commonProps}
    >
      {copyStatus > 0 ? 'Link Copied!' : children}
    </Button>
  ) : (
    <CTPopoverLabel label={label}>
      <IconButton {...commonProps}>
        {copyIcon}
      </IconButton>
    </CTPopoverLabel>
  );
}

CopyButton.propTypes = {
  /** Text to copy to clipboard */
  text: PropTypes.string,

  /** Primary content */
  children: PropTypes.node,

  /** callback on copy successed */
  onCopied: PropTypes.func,

  /** callback on copy failed */
  onError: PropTypes.func,
};

export default CopyButton;

