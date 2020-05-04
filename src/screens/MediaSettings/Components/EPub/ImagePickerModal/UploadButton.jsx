import React from 'react';
import { Button } from 'semantic-ui-react';
import { useDropzone } from 'react-dropzone';

function UploadButton({ onUpload }) {

  const onChange = ({ target: { files } }) => {
    onUpload(files[0]);
  }
  
  const { getRootProps, getInputProps } = useDropzone();

  return (
    <div className="ip-upload-btn ct-d-c-center mt-3">
      <Button 
        type="button"
        size="big" 
        {...getRootProps()}
      >
        <input {...getInputProps()} accept=".jpg,.jpeg,.png" onChange={onChange} />
        Browse Files
      </Button>
    </div>
  );
}

export default UploadButton;