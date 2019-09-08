/**
 * Button Group Components for Offering Editing Page
 */
import React, { useState, useCallback } from 'react'
import csv from 'fast-csv'
import { Button } from 'semantic-ui-react'
import { useCTContext } from 'components'
import { useDropzone } from 'react-dropzone'

/**
 * Buttons for creatind new offering
 */
export function SaveButtons(props) {
  const { progress } = props.state
  const { generalAlert } = useCTContext()
  const canSave = progress === 'Staffs'
  return (
    <>
      {
        canSave // can save the offering iff all the fields if filled
          &&
        <Button 
          positive 
          onClick={() => props.onCreate(generalAlert)} 
          content="Save"
          aria-label="save"
        />
      }
      <Button onClick={props.onCancel} content="Cancel" aria-label="cancel" />
    </>
  )
}

/**
 * Buttons for editing the offering
 */
export function EditButtons(props) {
  const { generalAlert } = useCTContext()
  const { offering, selectedCourses } = props.state
  const { termId, sectionName } = offering.offering
  const canSave = termId && sectionName && selectedCourses.length
  return (
    <>
      <Button 
        disabled={!canSave} 
        positive 
        onClick={() => props.onUpdate(generalAlert)} 
        content="Save"
        aria-label="save" 
      />
      
      <Button secondary onClick={props.onCancel} content="Cancel" aria-label="cancel" />
      {
        offering // can delete the offering iff the offering is loaded
        && 
        <Button onClick={props.showDeleteModal} content="Delete" aria-label="delete" />
      }
    </>
  )
}

export function UploadBtn({ addNew }) {
  const [mesg, setMesg] = useState('')
  const [loading, setLoading] = useState(false)
  const onChange = useCallback( ({target: {files}})=> {
    if (files.length > 1) setMesg('Sorry, you can only upload one file.')
    else {
      setLoading(true)
      var reader = new FileReader()
      reader.onload = function() {
        csv.fromString(reader.result)
          .on('data', data => {
            // console.log(data[0])
            addNew(data[0])
          })
          .on('end', () => setLoading(false))
      }
      reader.readAsBinaryString(files[0])
    }
  }, [addNew])
  
  const { getRootProps, getInputProps } = useDropzone()
  return (
    <div className="upload-btn">
      <Button {...getRootProps()} loading={loading}>
        <input {...getInputProps()} accept=".csv" onChange={onChange} />
        Upload a .csv file
      </Button><br/>
      <span>{mesg}</span>
      <span className="text-muted">
        Please upload a <strong>.csv file</strong> with a <strong>list of emails without header</strong> to add. 
        <br/>For example:
      </span>
      <div className="csv-demo">
        <p>{'<demo.csv>'}</p>
        <p>shawn@university.edu</p>
        <p>micheal2@university.edu</p>
        <p>xiaoming@university.edu</p>
        <p>...</p>
      </div>
    </div>
  )
}