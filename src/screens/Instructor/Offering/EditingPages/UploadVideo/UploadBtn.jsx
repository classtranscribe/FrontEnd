import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from 'semantic-ui-react';

export default function UploadBtn({ onUpload }) {
  const [mesg, setMesg] = useState('')
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 2) setMesg('You can upload no more than 2 files.')
    else onUpload(acceptedFiles)
  }, [onUpload])
  const {getRootProps, getInputProps, /* isDragActive */} = useDropzone({onDrop})
  return (
    <div className="upload-btn">
      <Button {...getRootProps()}>
        <input {...getInputProps()} accept=".mp4,.mov"/>
        Upload Video(s)
      </Button>
      <span>&ensp;{mesg}</span>
    </div>
  )
}