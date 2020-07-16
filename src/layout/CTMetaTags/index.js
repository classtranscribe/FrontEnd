import React from 'react';
import MetaTags from 'react-meta-tags';
import _ from 'lodash';



const CTMetaTags = (props) => {
  let metaTags;

  if (_.isEmpty(props.metaTags)) {
    metaTags = {};
  } else {
    metaTags = props.metaTags;
  }
  
    return (
      <MetaTags>
        <title>{metaTags.title}</title>
        <meta name="keywords" content={metaTags.keywords} />
        <meta property="og:description" content={metaTags.ogDescription} />
        <meta name="description" content={metaTags.description} />
        <meta property="og:title" content={metaTags.ogTitle} />
      </MetaTags>
    );
}

export default CTMetaTags;
