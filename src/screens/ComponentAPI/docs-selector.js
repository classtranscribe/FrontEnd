import { Fragment } from 'react';
import { CTFormUsage } from 'docs';

const createDocsData = (title, Component) => ({
  title,
  Component: Component || Fragment
});

/**
 * Get the docs data for a component
 * @param {String} type - the type of the component api
 * @returns {{title:string, Component:ReactNode}} the docs data
 */
export default function(type) {
  const docsSelector = {
    'ct-form': createDocsData('CTForm', CTFormUsage)
  };

  return docsSelector[type] || createDocsData('Unknown');
}