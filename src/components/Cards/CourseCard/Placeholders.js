import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { CTFragment } from 'layout';

function CardPlaceholder() {
  return (
    <CTFragment className="ct-course-card disabled">
      <Skeleton variant="rect" width={130} height={25} />
      <Skeleton className="mt-1" variant="rect" width={200} height={20} />

      <CTFragment margin={[10, 0,0,0]}>
        <Skeleton variant="text" width={160} />
        <Skeleton variant="text" width={230} />
        <Skeleton variant="text" width={230} />
      </CTFragment>
    </CTFragment>
  );
}

export default CardPlaceholder;
