import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { CTFragment, CTFormRow } from 'layout';
import { CourseCardHolder } from 'components';
import './index.scss';

function SectionHolder() {
  return (
    <CTFragment className="ct-homep section-con">
      <CTFragment padding={[20, 0]}>
        <Skeleton variant="rect" width={290} height={35} />
        <Skeleton variant="text" width={350} />
      </CTFragment>
      <CTFragment alignItCenter>
        {[1,2,3,4,5].map(sec => <CourseCardHolder key={sec} />)}
      </CTFragment>
    </CTFragment>
  );
}

function Placeholder() {
  return (
    <CTFragment padding="10" id="ct-homep-holder" aria-label="loading placeholder">
      <CTFormRow padding={[20,0,0,0]} gridClassName="d-flex align-items-center">
        <Skeleton variant="rect" className="w-100" height={66} />
        <Skeleton variant="rect" className="w-100" height={40} />
        <Skeleton variant="rect" className="w-100" height={40} />
      </CTFormRow>

      <CTFragment dFlexCol className="overflow-hidden">
        <SectionHolder />
        <SectionHolder />
        <SectionHolder />
      </CTFragment>
    </CTFragment>
  );
}

export default Placeholder;
