import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom';
import { Button } from 'pico-ui';
import { CTFragment, CTInput } from 'layout';
import { useInput } from 'hooks';
import { uurl } from 'utils';
import TimeString from 'utils/use-time';

function ImageWrapper({
  epub,
  id,
  disabled,
  imageAlt,
  timestamp,
  videoLink,
  chapter,
  onChooseImage,
  onRemoveImage,
  onImageAltChange,
  onLinkChange
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

  const [showLink, setShowLink] = useState(false);
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const handleLinkChange = (event) => {
    setLink(event.target.value);
  }
  const handleTextChange = (event) => {
    setText(event.target.value);
  }
  const handleInput = () => {
    // console.log(epub);
    let time = text.split(':');
    if (time.length === 2) {
      chapter.start = "00:".concat(text);
    } else if (time.length === 3) {
      chapter.start = text;
    }
    onLinkChange(epub);
    setShowLink(false);
  }
  const handleAddLink = () => {
    chapter.link = link;
    onLinkChange(epub);
    setShowLink(false);
  }
  const onLinkClick = () => {
    uurl.openNewTab(videoLink);
  }
  return disabled ? null : (
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
          {videoLink &&
            <Button
              uppercase
              color="white"
              icon="image"
              className="ct-epb shadow-btn"
              onClick={onLinkClick}
            >
              Go To {TimeString.toPrettierTimeString(timestamp)} in Video
            </Button>}
          {
            showLink &&
            <div>
              <div>
                <input onChange={handleTextChange} placeholder="Change video start time" />
                <button onClick={handleInput}> Change </button>
                <button onClick={() => setShowLink(false)}> Cancel</button>
                <input onChange={handleLinkChange} placeholder="Add slides link" />
                <button onClick={handleAddLink}> Change </button>
                <button onClick={() => setShowLink(false)}> Cancel</button>
              </div>
            </div>
          }
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
          label={`Image Alt Text${typeof alt.value !== "string" ? ` - Does not exist ` : alt.value.length > 100 ? ` - Too long! (${alt.value.length} characters). Maximum 100 characters recommended.` :
            alt.value.length === 0 ? " - A short text description is needed here" : ""}`}
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
