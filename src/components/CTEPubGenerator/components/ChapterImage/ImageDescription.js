import React from 'react'
import { ChapterText } from '../ChapterText'

function ImageDescription({
  id,
  description
}) {
  return (
    <ChapterText
      id={`epb-img-des-${id}`}
      text={description}
      attached="top"
      addNewText="Add description for above image"
    />
  );
}

export default ImageDescription;
