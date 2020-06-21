import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CTLayout } from 'layout';
import { MDXDocsContainer } from 'docs/layouts';
import { api } from 'utils';
import docsSelector from './docs-selector';

export function ComponentAPI(props) {
  const { name } = useParams();

  const Docs = docsSelector(name);

  const layoutProps = CTLayout.createProps({
    transition: true,
    responsive: true,
    footer: true,
    headingProps: {
      heading: Docs.title,
      icon: 'description',
      sticky: true,
      gradient: true,
      offsetTop: 30
    }
  });

  useEffect(() => {
    api.contentLoaded();
  }, []);

  return (
    <CTLayout {...layoutProps}>
      <MDXDocsContainer>
        <Docs.Component />
      </MDXDocsContainer>
    </CTLayout>
  );
}