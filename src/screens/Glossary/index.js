/* eslint-disable no-console */
import { CTLayout } from 'layout';
import { connect } from 'dva';
import GlossaryTable from './components/GlossaryTable/index.js';
import GlossaryBar from './components/GlossaryBar/index.js';

/**
 * object for the whole Glossary page
 */
const GlossaryWithRedux = ({ glossary, offeringId, courseId, courseName, sectionName, termName, dispatch }) => {
  const layoutProps = CTLayout.createProps({
    transition: true,
    responsive: true,
    footer: true
  });

  return (
    <CTLayout {...layoutProps}>
      <h1>Glossary</h1>
      <br />
      <GlossaryBar
        dispatch={dispatch}
        offeringId={offeringId}
      />
      <br />
      {offeringId ? <h1>{courseName}: {termName} {sectionName}</h1> : null}
      <GlossaryTable words={glossary} offeringId={offeringId} courseId={courseId} />
    </CTLayout>
  )
}

export const Glossary = connect(({ glossary: { glossary, offeringId, courseId, courseName, sectionName, termName } }) => ({
  glossary, offeringId, courseId, courseName, sectionName, termName
}))(GlossaryWithRedux);