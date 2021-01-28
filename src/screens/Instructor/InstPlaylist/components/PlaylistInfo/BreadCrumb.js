import React from 'react';
import { Link } from 'dva/router';
import { makeStyles } from '@material-ui/core/styles';
import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import MuiLink from '@material-ui/core/Link';
import { links } from 'utils/links';

const useStyles = makeStyles({
  link: {
    color: 'teal',
    '&:hover': {
      color: 'teal',
    }
  }
});

function BreadCrumb({
  offering,
  playlist
}) {
  const classes = useStyles();

  const linkProps = {
    component: Link,
    className: classes.link
  };

  return (
    <MuiBreadcrumbs aria-label="breadcrumb">
      <MuiLink {...linkProps} to={links.course(offering.id)}>
        {offering.fullNumber}
      </MuiLink>
      <MuiLink className={classes.link}>
        {playlist.name}
      </MuiLink>
    </MuiBreadcrumbs>
  );
}

export default BreadCrumb;

