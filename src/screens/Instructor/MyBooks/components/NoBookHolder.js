import React from 'react';
import { Link } from 'dva/router';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { CTFragment, CTText, useButtonStyles } from 'layout';
import { links } from 'utils';

export function NoCourseHolder() {
  const btn = useButtonStyles();

  return (
    <CTFragment center dFlexCol padding={[30, 0]}>
      <CTText muted padding="20" size="medium">Welcome to ClassTranscribe</CTText>
      
      <Button
        component={Link}
        variant="contained"
        className={btn.teal}
        size="large"
        startIcon={<AddIcon />}
        to={links.newCourse()}
      >
        create your first course
      </Button>
    </CTFragment>
  );
}
