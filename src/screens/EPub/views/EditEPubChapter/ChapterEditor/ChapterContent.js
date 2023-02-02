import React, { useState, useRef } from 'react';
import { CTFragment } from 'layout';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Cancel from '@material-ui/icons/Cancel';
import ChapterNewContent from './ChapterNewContent';
import { ChapterImage, ChapterText } from '../../../components';

function ChapterContent({
  id,
  key,
  content,
  index,
  condition,
  dispatch,
  onRemove,
  onTextChange,
  onImageChange,
  onInsert,
}) {
  const isTextContent = typeof content === 'string';
  const [tags, SetTags] = useState(() => {
    return !condition ? [] : condition;
  });
  const Ref = useRef();
  const handleOnSubmit = (e) => {
    e.preventDefault();
    SetTags([...tags, Ref.current.value]);
    dispatch({
      type: 'epub/updateEpubData',
      payload: {
        action: 'setChapterContent',
        payload: { contentIdx: index, value: [...tags, Ref.current.value], type: 'condition' },
      },
    });
    Ref.current.value = '';
  };
  const handleDelete = (value) => {
    const newtags = tags.filter((val) => val !== value);
    SetTags(newtags);
    dispatch({
      type: 'epub/updateEpubData',
      payload: {
        action: 'setChapterContent',
        payload: { contentIdx: index, value: newtags, type: 'condition' },
      },
    });
  };

  const Tags = ({ data }) => {
    return (
      <Box
        sx={{
          background: '#283240',
          height: '100%',
          display: 'flex',
          padding: '0.4rem',
          margin: '0 0.5rem 0 0',
          justifyContent: 'center',
          alignContent: 'center',
          color: '#ffffff',
        }}
      >
        <Grid direction="row" spacing={1}>
          <Typography>{data}</Typography>
          <Cancel
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              handleDelete(data);
            }}
          />
        </Grid>
      </Box>
    );
  };

  return (
    <CTFragment>
      <ChapterNewContent onInsert={onInsert} />
      {isTextContent ? (
        <ChapterText id={id} text={content} onSaveText={onTextChange} />
      ) : (
        <ChapterImage
          id={id}
          image={
            Object.prototype.hasOwnProperty.call(content, '__data__') ? content.__data__ : content
          }
          enableChapterScreenshots
          onChooseImage={onImageChange}
          onRemoveImage={onRemove}
        />
      )}
      <form onSubmit={handleOnSubmit}>
        <TextField
          inputRef={Ref}
          fullWidth
          variant="standard"
          size="small"
          sx={{ margin: '1rem 0' }}
          margin="none"
          placeholder={tags.length < 5 ? 'Enter tags' : ''}
          InputProps={{
            startAdornment: (
              <Box sx={{ margin: '0 0.2rem 0 0', display: 'flex' }}>
                {tags.map((data, idx) => {
                  return <Tags data={data} handleDelete={handleDelete} key={idx} />;
                })}
              </Box>
            ),
          }}
        />
      </form>
    </CTFragment>
  );
}

export default ChapterContent;
