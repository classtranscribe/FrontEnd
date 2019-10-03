import React, { useState, useEffect } from 'react'
import $ from 'jquery'
import { Button } from 'semantic-ui-react'
import { search } from 'utils'
import { AdminListItem } from '../Components'

export default function InstructorList({ instructors, loading, currUni, onInactive }) {
  const [result, setResult] = useState([])

  useEffect(() => {
    setResult(instructors)
  }, [instructors])

  const onSearch = (keyCode) => {
    if (keyCode === 13) {
      setResult(search.getInstructorResult(instructors, $('#inst-filter')[0].value))
    }
  }

  return (
    <>
      <div className="filter">
        <input 
          id="inst-filter"
          placeholder="Search for instructors"
          onKeyDown={({ keyCode }) => onSearch(keyCode)}
        />
        <Button basic
          icon="search" 
          aria-label="search"
          onClick={() => onSearch(13)}
        />
        <Button basic
          content="Reset"
        />
      </div>
      {result.map( inst => (
        <AdminListItem 
          header={`${inst.firstName} ${inst.lastName}`} 
          path="instructor" 
          inactive={() => onInactive(inst.email)}
          loading={loading}
          id={inst.id} key={inst.id}
          items={[
            `University: ${currUni.name}`,
            `Email: ${inst.email}`
          ]}
        />
      ))}     
    </>
  )
}