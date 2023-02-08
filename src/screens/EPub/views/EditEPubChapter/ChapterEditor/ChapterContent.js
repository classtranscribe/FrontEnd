import React, {useState, useRef} from 'react';
import { CTFragment } from 'layout';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Cancel from '@material-ui/icons/Cancel';
import ChapterNewContent from './ChapterNewContent';
import { ChapterImage, ChapterText } from '../../../components';
import { ArrowLeft } from '@material-ui/icons';

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
  const handleOnSubmit = (e) => { // 
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

  const Tags = ({data}) => {
    return (
      <Box style={boxstyle} // all of this inline info does nothing to style
        /*sx={{
          
          background: "#283240",
          //width: "25%",
          height: "100%",
          display: "flex", //inline
          float: "left", //float left
          padding: "0.4rem",
          margin: "0 0 0.5rem 0",
          justifyContent: "center",
          alignContent: "center",
          color: "#ff0000",
          
        }}*/
      >
        {/* <Grid direction='row' spacing={1}>  */}
          <Typography style = {tagstyle}>{data}</Typography>
          <Cancel
            style= {tagstyle}
            onClick={() => {
              handleDelete(data);
            }}
          />
        {/* </Grid> */}
      </Box>
    );
  };
  const boxstyle = {
    backgroundColor: '#D3D3D3', //replace with actual hex code
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
              {/* // <Box sx={{ margin: "0 0.2rem 0 0", display: "flex"}}> */}
        <CTFragment alignItCenter>
            {tags.map((data, idx) => {
              return (
                <Tags data={data} handleDelete={handleDelete} key={idx} />
            );
          })}
        </CTFragment>
            
          
       
      </form>

    </CTFragment>
  );
}

export default ChapterContent;
