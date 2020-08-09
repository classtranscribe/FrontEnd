import React from 'react';
import { Button } from 'pico-ui';
import { useTheme, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { CTFragment, CTInput } from 'layout';

function ImageWrapper({
  id,
  imageAlt,
  onChooseImage,
  onRemoveImage,
  onImageAltChange
}) {
  const canRemoveImage = Boolean(onRemoveImage);

  const darkTheme = createMuiTheme({
    palette: {
      type: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CTFragment list hBetween className="ch-img-wrapper" padding="20">
        <CTFragment hEnd>
          <Button.Group>
            <Button 
              uppercase 
              color="white" 
              icon="add_photo_alternate"
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
                className="ct-epb shadow-btn"
                onClick={onRemoveImage}
              >
                Remove
              </Button>
            }
          </Button.Group>
        </CTFragment>

        <CTFragment>
          <CTInput 
            textarea
            underlined
            id={`image-alt-input-${id}`}
            label="Image Alt"
            defaultValue={imageAlt}
            onChange={onImageAltChange}
          />
        </CTFragment>
      </CTFragment>
    </ThemeProvider>
  );
}

export default ImageWrapper;
