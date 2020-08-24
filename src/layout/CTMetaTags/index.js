import React from 'react';
import PropTypes from 'prop-types';
import MetaTags from 'react-meta-tags';

/*
  If meta tags are not provided for a page the meta tags are replaced with the default meta tags.
*/
const defaultMetaTags = {
  description: 'Improve your learning outcomes as a university student, and watch lectures with equitable access and support for non-native speaking students and students with disabilities.',
  title: 'ClassTranscribe',
  keywords: 'Video, ClassTranscribe, Online Learning, Education, Accessibility, Upload, Transcription'
};


function CTMetaTags(props) {
  const {
    title = defaultMetaTags.title,
    description = defaultMetaTags.description,
    keywords = defaultMetaTags.keywords
  } = props;

  const fullTitle = defaultMetaTags.title === title 
                  ? title 
                  : `${title} | ClassTranscribe`;
  
  return (
    <MetaTags>
      {title && <title>{fullTitle}</title>}
      {title && <meta property="og:title" content={fullTitle} />}
      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
    </MetaTags>
  );
}

CTMetaTags.propTypes = {
  /** <title>{title}</title> */
  title: PropTypes.string,

  /** <meta name="description" content={description} /> */
  description: PropTypes.string,

  /** <meta name="keywords" content={keywords} /> */
  keywords: PropTypes.string
};

export default CTMetaTags;
