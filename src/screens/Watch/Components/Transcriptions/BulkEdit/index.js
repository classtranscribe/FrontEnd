import React, { useState, useEffect } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { CTButton } from '../../../../../components'
import _ from 'lodash'

import Caption from './Caption'

import './index.css'
import { connectWithRedux, transControl } from '../../../Utils'

const pageOptions = [
  {value: 20, text: '20 lines'},
  {value: 40, text: '40 lines'},
  {value: 60, text: '60 lines'}
]

function BulkEdit({
  transcript=[],
  currCaption,
  time,
}) {

  const [page, setPage] = useState(1)
  const [linePerPage, setLinePerPage] = useState(20)
  const [transCpy, setTransCpy] = useState(_.cloneDeep(transcript))
  const totalPage = Math.ceil(transcript.length / linePerPage)

  useEffect(() => {
    transControl.setTransCpy = setTransCpy
  }, [])

  const prevPage = () => {
    setPage( page => page - 1)
  }

  const nextPage = () => {
    setPage( page => page + 1)
  }

  const onSave = () => {
    transControl.bulkEditOnSave()
  }

  const onCancel = () => {
    transControl.bulkEdit(false)
  }

  const changeLinePerPage = value => () => {
    setLinePerPage(value)
  }



  return (
    <div className="trans-bulk-edit">
      <div className="trans-be-top-btns">
        <div>
          <CTButton text="Save" color="green" onClick={onSave} />
          <CTButton text="Cancel" color="primary" onClick={onCancel} />
        </div>
        <div className="trans-be-btn-group">
          <div className="trans-be-p-text">Page {page}/{totalPage}</div>
          <div className="trans-be-btn-group">
            <button
              className="plain-btn watch-search-btn page-btn"
              disabled={page === 1}
              onClick={prevPage}
            >
              <span tabIndex="-1"><i className="material-icons">chevron_left</i></span>
            </button>
            <button
              className="plain-btn watch-search-btn page-btn"
              disabled={page === totalPage}
              onClick={nextPage}
            >
              <span tabIndex="-1"><i className="material-icons">chevron_right</i></span>
            </button>
          </div>

          <div className="trans-be-p-sel">
            <Dropdown text={`${linePerPage} lines per page`} direction="left">
              <Dropdown.Menu>
                {pageOptions.map( pageopt => (
                  <Dropdown.Item 
                    key={pageopt.text} 
                    text={pageopt.text} 
                    description='per page' 
                    onClick={changeLinePerPage(pageopt.value)} 
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>

      <table className="trans-be-table">
          <col width="30px" />
          <col width="80px" />
          <col width="80px" />
          <col width="1*" />
          <col width="40px" />
        <tbody>
          <tr>
            <th> </th>
            <th className="td-center">Begin</th>
            <th className="td-center">End</th>
            <th className="td-center">Text</th>
            <th className="td-center">Actions</th>
          </tr>
          {transCpy.map( (cap, index) => (index < page * linePerPage) && (index >= (page-1)*linePerPage) ? (
            <Caption caption={cap} actualIndex={index} />
          ) : null)}
        </tbody>
      </table>
      {/* {
        transcript.map( cap => (
          <div></div>
        ))
      } */}
      <div className="trans-be-bottom-btns">
        <div className="trans-be-btn-group">
          <div className="trans-be-p-text">Page {page}/{totalPage}</div>
          <div className="trans-be-btn-group">
            <button
              className="plain-btn watch-search-btn page-btn"
              disabled={page === 1}
              onClick={prevPage}
            >
              <span tabIndex="-1"><i className="material-icons">chevron_left</i></span>
            </button>
            <button
              className="plain-btn watch-search-btn page-btn"
              disabled={page === totalPage}
              onClick={nextPage}
            >
              <span tabIndex="-1"><i className="material-icons">chevron_right</i></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default connectWithRedux(
  BulkEdit,
  ['time', 'currCaption'],
  []
)