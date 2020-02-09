import React, { useState, useEffect } from 'react'
import { connectWithRedux } from '_redux/media-settings'
import { PlaceHolder } from '../../../Instructor/Components/Placeholder'
import { MSPSidebar } from '../MSPSidebar'
import { api, util } from 'utils'

function Sidebar({
  epubData=[]
}) {

  const [chapters, setChapters] = useState([])

  const resetChapters = () => {}

  useEffect(() => {
    if (epubData.length > 0) {
      setChapters(epubData)
    }
  }, [epubData])
  
  return (
    <MSPSidebar id="msp-epub-sidebar">
      <MSPSidebar.Item dark
        icon="refresh"
        title="RESET CHAPTERS"
        description="You can manage and reset chapters and here."
        onClick={resetChapters}
      />

      <div className="ip-sb-title ct-d-r-center-v">
        <i className="material-icons" aria-hidden="true">collections_bookmark</i>
        <h2>Chapters</h2>
      </div>

      {
        chapters.length > 0
        ?
        <div className="ct-d-c w-100 ct-a-fade-in">
          {chapters.map((chapter, index) => (
            <MSPSidebar.Item
              title={`Chapter ${index + 1}`}
              image={api.getMediaFullPath(chapter.image)}
              description={util.getFittedName(chapter.text, 50)}
            />
          ))}
        </div>
        :
        <PlaceHolder />
      }
    </MSPSidebar>
  )
}

export default connectWithRedux(
  Sidebar,
  ['epubData'],
  []
)