import React, {useState, useRef} from 'react';
import { CTFragment } from 'layout';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Cancel from '@material-ui/icons/Cancel';
import ChapterNewContent from './ChapterNewContent';
import { ChapterImage, ChapterText } from '../../../components';

let Tags = function({data, handleDelete}) {
  const boxstyle = {
    backgroundColor: '#D3D3D3', 
    overflow: 'scroll',
    padding: '0.25rem 0.25rem 0.25rem 0.5rem',
    margin: '0.25rem 1rem 0.25rem 0',
    display: 'flex',
    borderRadius: '1rem',
  };

  const tagstyle = {
    float: 'left',
    margin: '0 0.25rem 0 0',
    cursor: 'default',
  }

  return (
    <Box style={boxstyle}>
      <Typography style={tagstyle}>{data}</Typography>
      <Cancel
        style={tagstyle}
        onClick={() => {
          handleDelete(data);
        }}
      />
    </Box>
  );
}

const ChapterContent = function({
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
  const [tags, SetTags] = useState(() => !condition ? [] : condition);
  const Ref = useRef();
  const handleOnSubmit = (e) => { 
    e.preventDefault();
    SetTags([...tags, Ref.current.value]);
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'setChapterContent', payload: { contentIdx: index, value: [...tags, Ref.current.value], type: 'condition' }
      }
    });
    Ref.current.value = "";
  };
  const handleDelete = (value) => {
    const newtags = tags.filter((val) => val !== value);
    SetTags(newtags);
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'setChapterContent', payload: { contentIdx: index, value: newtags, type: 'condition' }
      }
    });
  };
  
  return (
    <CTFragment>
      <ChapterNewContent onInsert={onInsert} />
      {
        isTextContent ? (
          <ChapterText 
            id={id}
            text={content}
            onSaveText={onTextChange}
          />
        ) : (
          <ChapterImage
            id={id}
            image={Object.prototype.hasOwnProperty.call(content, "__data__") ? content.__data__ : content}
            enableChapterScreenshots
            onChooseImage={onImageChange}
            onRemoveImage={onRemove}
          />
        )
      }
      <form onSubmit={handleOnSubmit}> 
        <TextField
          inputRef={Ref}
          fullWidth
          variant='standard'
          size='small'
          sx={{ margin: "1rem 0" }}
          margin='none'
          placeholder={tags.length < 5 ? "Enter tags" : ""} // tagging specific parts of the book ie. solutions
        />  
        <CTFragment alignItCenter>
          {tags.map((data, idx) => (
            <Tags data={data} handleDelete={handleDelete} key={idx} />
            ))}
        </CTFragment>
            
          
       
      </form>

    </CTFragment>
  );
}

export default ChapterContent;
