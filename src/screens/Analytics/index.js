import React from 'react';
import { CTLayout } from 'components';

export function Analytics() {
  const layoutProps = CTLayout.createProps({
    transition: true,
    responsive: true,
    footer: true,
    headingProps: {
      heading: 'Personal Analytics',
      icon: 'bar_chart',
      sticky: true,
      gradient: true,
      offsetTop: 30
    }
  });

  return (
    <CTLayout {...layoutProps} />
  )
}
