import React from 'react'
import ChapterText from '../ChapterText'

function ImageDescription({
  id,
  description,
  onChange
}) {
  return (
    <ChapterText
      id={`epb-img-des-${id}`}
      text={description}
      attached="top"
      addNewText="Add description for above image"
      onSaveText={onChange}
      height='200px'
    />
  );
}

export default ImageDescription;
