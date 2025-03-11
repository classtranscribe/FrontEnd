import React from 'react'
import DescriptionText from '../DescriptionText';

function ImageDescription({
  id,
  descriptions,
  onChange
}) {
  if (Array.isArray(descriptions)) {
    if (descriptions[descriptions.length - 1] !== "") {
      descriptions.push("");
    }
    return (
      <>
        {
          descriptions.map((item, index) =>
            <DescriptionText
              id={`epb-img-des-${id}-${index}`}
              text={item}
              attached="top"
              addNewText="Add description for above image"
              onSaveText={(text) => onChange(text, index)}
              height='200px'
            />
          )
        }
      </>
    )
  }
  return (
    <DescriptionText
      id={`epb-img-des-${id}`}
      text={descriptions}
      attached="top"
      addNewText="Add description for above image"
      onSaveText={onChange}
      height='200px'
    />
  );
}

export default ImageDescription;
