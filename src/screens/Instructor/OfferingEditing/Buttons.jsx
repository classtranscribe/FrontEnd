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
  const { generalAlert } = useCTContext()

  const { offering, selectedCourses } = props.state
  const { termId, sectionName } = offering.offering
  const canSave = termId && sectionName && selectedCourses.length

  return (
    <>
      <Button 
        positive 
        onClick={() => props.onCreate(generalAlert)} 
        content="Save"
        aria-label="save"
        disabled={!canSave}
      />
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
      <Button onClick={props.showDeleteModal} content="Delete" aria-label="delete" disabled={!canSave} />
    </>
  )
}

export function UploadBtn({ addNew }) {
  const [mesg, setMesg] = useState('')
  const [loading, setLoading] = useState(false)
  const { generalAlert } = useCTContext()

  const onChange = useCallback( ({ target: { files } }) => {
    if (files.length > 1) {
      setMesg('Sorry, you can only upload one file.')
    } else {
      setLoading(true)
      var reader = new FileReader()
      reader.onload = function() {
        csv.fromString(reader.result)
          .on('data', data => addNew(data[0]))
          .on('end', () => setLoading(false))
          .on('error', () => generalAlert({
            header: "Invalid file format",
            text: "Please follow the instruction and upload a .csv file with a list of emails only. NOTICE: There should be no headers.",
            type: "danger",
            position: "top",
            contactUs: true,
          }, -1))
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
      
      {/* Instructions */}
      <span className="text-muted">
        Please upload a <strong>.csv file</strong> with a <strong>list of emails without header</strong>. 
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