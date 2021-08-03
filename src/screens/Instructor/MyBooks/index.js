import React from 'react';
import ErrorTypes from 'entities/ErrorTypes';
import { CTLayout, CTFragment, CTFilter, CTErrorWrapper, CTHeading, makeEl } from 'layout';
import _ from 'lodash';
import { ARRAY_INIT, api } from 'utils';
import { connect } from 'dva';
import { BookList, NoBookHolder } from './components';
// import { CTHeading, makeEl} from 'layout';
import { Link } from 'dva/router';

function sortOfferings(offerings = [], terms = []) {
  let currentOfferings = [];
  let pastOfferings = [];

  if (offerings === ARRAY_INIT || ErrorTypes.isError(offerings)) {
    return { currentOfferings, pastOfferings };
  }

  let currTermId = (terms[0] || {}).id;

  _.forEach(offerings, (off) => {
    if (off.term && off.term.id === currTermId) {
      currentOfferings.push(off);
    } else {
      pastOfferings.push(off);
    }
  });
  // console.log({ currentOfferings, pastOfferings })
  return { currentOfferings, pastOfferings };
}

const MyBooksWithRedux = (props) => {
  const layoutProps = CTLayout.createProps({
    transition: true,
    responsive: true,
    footer: true,
    headingProps: {
      heading: 'My Books',
      icon: 'auto_stories',
      sticky: true,
      gradient: true,
      offsetTop: 30,
    },
    metaTagsProps: {
      title: 'My Books',
    },
  });
  const { instcourse } = props;
  const { offerings, terms } = instcourse;
  const loading = offerings === ARRAY_INIT;
  const error = api.isError(offerings);
  const noOffering = !loading && offerings.length === 0;

  const offeringResult = (result) => {
    const { currentOfferings, pastOfferings } = sortOfferings(result, terms); // TODO

    return (
      <CTFragment fadeIn loading={loading} error={error}>
        <BookList title="Current Courses" offerings={currentOfferings} />
        <BookList title="Past Courses" offerings={pastOfferings} />
      </CTFragment>
    );
  };

  const filterProps = {
    withDefaultFilter: true,
    data: offerings,
    keys: ['courseName', 'fullNumber', 'sectionName', 'termName'],
  };

  const errorProps = {
    fixed: false,
    show: true,
    code: offerings,
    header: 'There is an error when loading your courses.',
    description: 'Please try to refresh page or contact us if have problems.',
    signInButton: false,
  };

  const fragmentProps = {
    padding: [0, 30],
    error,
    errorElement: <CTErrorWrapper {...errorProps} />,
  };
  
  const tempEpubLink =
    'http://localhost:3000/media-settings/7eb1dd8b-f046-491a-a663-91a57608b03a/epub';

  const mybookElement = makeEl(CTHeading, {
    as: tempEpubLink ? Link : 'h3',
    // icon,
    to: tempEpubLink,
    highlightIcon: true,
    className: 'ct-homep section-title',
    children: 'UI HEALTH_GALA_PARTNERSHIP 2021',
  });

  return (
    <CTLayout {...layoutProps}>
      <CTFragment className="ct-mybook">{mybookElement}</CTFragment>
      <CTFragment {...fragmentProps}>
        {error ? null : noOffering ? (
          <NoBookHolder />
        ) : (
          <CTFilter {...filterProps}>{offeringResult}</CTFilter>
        )}
      </CTFragment>
    </CTLayout>
  );
};
export const MyBooks = connect(({ instcourse, loading }) => ({
  instcourse,
}))(MyBooksWithRedux);
