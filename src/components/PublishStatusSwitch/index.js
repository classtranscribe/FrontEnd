import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import PublishStatus from 'entities/PublishStatus';
import { CTPopoverLabel } from 'layout';
import './index.scss';

function PublishStatusSwitch(props) {
  const { status, onPublish, onUnpublish } = props;

  const isPublished = status === PublishStatus.Published;

  const icon = isPublished ? 'lens' : 'panorama_fish_eye';
  const text = isPublished ? 'Published' : 'Unpublished';
  const label = "Click to " + (isPublished ? 'unpublish' : 'publish');

  const handleClick = () => {
    if (isPublished && typeof onUnpublish === 'function') {
      onUnpublish();
    } else if (typeof onPublish === 'function') {
      onPublish();
    }
  };

  return (
    <span className={cx('ct-publish-btn-con', { isPublished })}>
      <CTPopoverLabel label={label}>
        <span
          tabIndex="0"
          role="checkbox"
          aria-checked={isPublished.toString()}
          aria-label={label}
          className="ct-publish-btn"
          onClick={handleClick}
        >
          <span className="ct-publish-btn-sub" tabIndex="-1">
            <span className="ct-publish-btn-icon material-icons">{icon}</span>
            <span className="ct-publish-btn-txt">{text}</span>  
          </span>
        </span>
      </CTPopoverLabel>
    </span>
  );
}

PublishStatusSwitch.propTypes = {
  status: PropTypes.number, 
  onPublish: PropTypes.func, 
  onUnpublish: PropTypes.func
};

export default PublishStatusSwitch;

