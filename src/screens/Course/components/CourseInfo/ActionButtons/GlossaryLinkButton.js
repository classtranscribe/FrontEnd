import React from 'react';
import cx from 'classnames';
import { Link } from 'dva/router';
import IconButton from '@material-ui/core/IconButton';
import { links } from 'utils/links';
import { useButtonStyles, CTPopoverLabel } from 'layout';
import { MenuBook } from '@material-ui/icons';

function GlossaryLinkButton(props) {
  const { offeringId } = props;

  const btn = useButtonStyles();

  return (
    <CTPopoverLabel label="Glossary">
      <IconButton
        component={Link}
        className={cx(btn.tealLink, 'mb-2', 'p-2', 'ct-a-fade-in')}
        // to={links.courseGlossary("", offeringId)}
        to={links.courseGlossary(offeringId)}
      >
        <MenuBook />
      </IconButton>
    </CTPopoverLabel>
  );
}


export default GlossaryLinkButton;

