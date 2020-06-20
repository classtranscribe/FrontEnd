import React from 'react';
import { Button } from 'semantic-ui-react';
import { CTFragment } from 'layout';
import { useDropzone } from 'react-dropzone';
import { uemail } from 'utils';
import './index.scss';

export function UploadButton({ addNew }) {
  const { getRootProps, getInputProps } = useDropzone();

  const onChange = 1;

  return (
    <CTFragment className="email-list-uploadbtw-container">
      <Button className="email-list-uploadbtw" type="button" {...getRootProps()}>
        <input {...getInputProps()} accept=".csv,.txt" onChange={onChange} />
        Upload a csv/txt file
      </Button>
    </CTFragment>
  );
}