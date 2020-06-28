import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
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

  return (
    <MuiBreadcrumbs aria-label="breadcrumb">
      <Link className={classes.link} href={links.offeringDetail(offering.id)}>
        {offering.fullNumber}
      </Link>
      <Link className={classes.link}>
        {playlist.name}
      </Link>
    </MuiBreadcrumbs>
  );
}

export default BreadCrumb;

