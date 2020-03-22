import React from 'react'
import EpubListItem from './EpubListItem'
import { util } from 'utils'

export default function EpubList({
  chapters=[],
}) {

  console.log(chapters)
  return (
    <div className="msp-ee-el-con ct-d-c">
      <div className="msp-ee-el-header">
        <h1>Managing Your Epub Book</h1>
        <p>
          Set breakpoints between the screen shots below.
        </p>
      </div>

      <div className="ct-d-c ee-el-chapters">
        {chapters.map((chapter, index) => (
          <div key={`ee-el-ch-${index}`} className="ct-d-c ee-el-items">

            <div className="ee-el-ch-title">
              <h2 contentEditable
                className="ct-div-editable"
                onKeyDown={util.preventBreakLine}
              >
                {chapter.title}
              </h2>
            </div>

            {
              chapter.items.map(item => (
                <EpubListItem key={item.id} item={item} />
              ))
            }

          </div>
        ))}
      </div>
    </div>
  )
}
