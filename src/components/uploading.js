import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from 'react-bootstrap'

/**
 * @param props
 * - onUploading()
 * - setAlert()
 * - onAlert()
 */
export function UpLoadVideosContainer(props) {
  const onDrop = useCallback(acceptedFiles => {
    props.onUploading();
    handleVideoUploaded(acceptedFiles, props);
    props.onUploading();
  }, [props]);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
  
  return (
    <Button variant="secondary" className="upload-video" {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p><i class="fas fa-cloud-upload-alt"></i> Drag & drop some files here<br/>or click to select files</p>
      }
    </Button>
  )
}

/**
 * 
 * @param {*} acceptedFiles - video files
 * @param {*} props - inherit
 * - setAlert()
 * - onAlert()
 */
function handleVideoUploaded(acceptedFiles, props) {
  // alert(acceptedFiles[0].type)
  if (acceptedFiles[0].type !== 'image/png') props.setAlert('wrongType');
  else  props.setAlert('uploaded');
  props.onAlert();
  setTimeout(()=>{
    props.onAlert();
  }, 6000);
}