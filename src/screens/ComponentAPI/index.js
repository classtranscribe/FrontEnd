import React from 'react';
import { useParams } from 'dva/router';
import { useCTDocTitle, useLoaded } from 'hooks';
import { CTLayout } from 'layout';
import { MDXDocsContainer } from 'docs/layouts';
import docsSelector from './docs-selector';

export function ComponentAPI(props) {
  const { type } = useParams();
  const Docs = docsSelector(type || 'ct-form');
  
  useLoaded();
  useCTDocTitle(`${Docs.title} | Component API`);

  const layoutProps = CTLayout.createProps({
    transition: true,
    responsive: true,
    footer: true,
    headingProps: {
      heading: Docs.title,
      icon: 'description',
      sticky: false,
      gradient: true,
      offsetTop: 30
    }
  });

  return (
    <CTLayout {...layoutProps}>
      <MDXDocsContainer>
        <Docs.Component />
      </MDXDocsContainer>
    </CTLayout>
  );
}