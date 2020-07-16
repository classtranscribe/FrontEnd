import React from 'react';
import MetaTags from 'react-meta-tags';
import _ from 'lodash';

/*
  If meta tags are not provided for a page the meta tags are replaced with the default meta tags.
*/
const defaultMetaTags = {
    description : 'Improve your learning outcomes as a university student, and watch lectures with equitable access and support for non-native speaking students and students with disabilities.',
    title : 'ClassTranscribe',
    ogTitle : 'ClassTranscribe',
    ogDescription : 'Improve your learning outcomes as a university student, and watch lectures with equitable access and support for non-native speaking students and students with disabilities.',
    keywords : 'Video, ClassTranscribe, Online Learning, Education, Accessibility, Upload, Transcription'
}


const CTMetaTags = (props) => {
  let metaTags;

  if (_.isEmpty(props.metaTags)) {
    metaTags = defaultMetaTags;
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
