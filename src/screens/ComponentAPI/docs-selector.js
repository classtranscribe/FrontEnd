import { Fragment } from 'react';
import { CTFormUsage } from 'docs';

const getDocsData = (title, Component) => ({
  title,
  Component: Component || Fragment
});

/**
 * Get the docs data for a component
 * @param {String} name - the name of the component api
 * @returns {{title:string, Component:ReactNode}} the docs data
 */
export default function(name) {
  const docsSelector = {
    'ct-form': getDocsData('CTForm', CTFormUsage)
  };

  return docsSelector[name] || getDocsData('Unknown');
}