import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from 'semantic-ui-react';

export default function UploadBtn({ video1 }) {
  const [uploaded, setUploaded] = useState(false)
  const [file, setFile] = useState({})
  const onDrop = useCallback(acceptedFiles => {
    setFile(acceptedFiles[0])
    console.log(acceptedFiles[0])
    setUploaded(true)
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  return (
    <div className="upload-btn">
      <p>{video1 ? 'Upload 1st Video' : 'Upload 2nd Video'}</p>
      <Button {...getRootProps()}>
        <input {...getInputProps()} accept=".mp4,.mov"/>
        {uploaded ? 'change video' : 'Upload Video'}
      </Button>
      <span>&ensp;{file.name}</span>
    </div>
  )
}