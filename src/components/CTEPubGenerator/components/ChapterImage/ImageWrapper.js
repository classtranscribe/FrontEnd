import React, { useEffect } from 'react';
import { Button } from 'pico-ui';
import { CTFragment, CTInput } from 'layout';
import { useInput } from 'hooks';

function ImageWrapper({
  id,
  imageAlt,
  onChooseImage,
  onRemoveImage,
  onImageAltChange
}) {
  const canRemoveImage = Boolean(onRemoveImage);
  const alt = useInput(imageAlt);

  useEffect(() => {
    if (imageAlt !== alt.value) {
      alt.setValue(imageAlt);
    }
  }, [imageAlt]);

  const handleSaveAlt = () => {
    if (typeof onImageAltChange === 'function') {
      onImageAltChange(alt.value);
    }
  };

  return (
    <CTFragment dFlexCol justConBetween className="ch-img-wrapper" padding="20">
      <CTFragment justConEnd>
        <Button.Group>
          <Button 
            uppercase 
            color="white" 
            icon="image"
            className="ct-epb shadow-btn"
            onClick={onChooseImage}
          >
            Choose Image
          </Button>

          {
            canRemoveImage
            &&
            <Button
              uppercase 
              icon="delete"
              color="white" 
              className="ct-epb shadow-btn"
              onClick={onRemoveImage}
            >
              Remove
            </Button>
          }
        </Button.Group>
      </CTFragment>

      <CTFragment alignItEnd>
        <CTInput 
          // textarea
          underlined
          darkMode
          id={`image-alt-input-${id}`}
          label="Image Alt"
          value={alt.value}
          onChange={alt.onChange}
          onReturn={handleSaveAlt}
        />

        {
          alt.value !== imageAlt
          &&
          <Button
            color="white"
            uppercase
            compact
            onClick={handleSaveAlt}
            className="ct-a-fade-in ml-3"
          >
            Save
          </Button> 
        }
        
      </CTFragment>
    </CTFragment>
  );
}

export default ImageWrapper;
