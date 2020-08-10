import React, { useEffect } from 'react';
import { Button } from 'pico-ui';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
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

  const darkTheme = createMuiTheme({
    palette: {
      type: 'dark',
    },
  });

  const handleSaveAlt = () => {
    if (typeof onImageAltChange === 'function') {
      onImageAltChange(alt.value);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CTFragment list hBetween className="ch-img-wrapper" padding="20">
        <CTFragment hEnd>
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

        <CTFragment vEnd>
          <CTInput 
            // textarea
            underlined
            id={`image-alt-input-${id}`}
            label="Image Alt"
            value={alt.value}
            onChange={alt.onChange}
            onReturn={handleSaveAlt}
            className="mr-3"
          />

          <Button
            color="white"
            uppercase
            compact
            disabled={alt.value === imageAlt}
            onClick={handleSaveAlt}
          >
            Save
          </Button>
        </CTFragment>
      </CTFragment>
    </ThemeProvider>
  );
}

export default ImageWrapper;
