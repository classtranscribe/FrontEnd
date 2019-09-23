import React, { useState } from 'react'
import { Select, Button, Popup } from 'semantic-ui-react'
import { useCTContext } from 'components'
import DownloadTransButton from './DownloadTransButton'
// Vars
import { SEARCH_IN_COURSE, SEARCH_IN_VIDEO } from '../constants'
import { capSearch, handleExpand } from '../watchUtils'
import { api, handleData, util } from 'utils'

const searchOptions = [
  {key: SEARCH_IN_VIDEO, value: SEARCH_IN_VIDEO, text: 'In-Video Search'},
  {key: SEARCH_IN_COURSE, value: SEARCH_IN_COURSE, text: 'In-Course Search'}
]

export default function ToolBar({ media, captions, setResults, canReset, sendUserAction, offeringId, playlists }) {
  const [loadingResults, setLoadingResults] = useState(false)
  const [searchType, setSearchType] = useState(SEARCH_IN_VIDEO)
  const [searchInput, setSearchInput] = useState('')
  const { generalAlert } = useCTContext()

  const changeSearchType = (e, { value }) => {
    setSearchType(value)
  }

  const handleOnChange = ({ target: { value } }) => {
    setSearchInput(() => value)
  }

  const searchInCourse = async () => {
    setLoadingResults(true)
    const { data } = await api.searchCaptionInOffering(offeringId, searchInput)

    const parsedResult = []
    data.forEach( line => {
      var _playlist = handleData.findById(playlists, line.playlistId)
      if (_playlist === 'NOT FOUND') _playlist = {name: '', medias: []}
      var _media = handleData.findById(_playlist.medias, line.mediaId)
      if (_media === 'NOT FOUND') _media = {}
      parsedResult.push({ 
        ...line.caption, 
        playlistName: _playlist.name,
        mediaName: api.parseMedia(_media).mediaName,
        mediaId: line.mediaId, 
      })
    })
    console.log('parsedResult', parsedResult)
    const { courseNumber } = util.parseSearchQuery()
    handleExpand(true)
    generalAlert({text: `Result of '${searchInput}' in ${courseNumber}`, position: 'bottom'})
    setResults(parsedResult)
    setLoadingResults(false)
  }

  const handleOnKeyDown = ({ keyCode }) => {
    if (keyCode !== 13) return;
    if (searchType === SEARCH_IN_VIDEO) {
      setResults(() => capSearch.getResult(captions, searchInput))
      generalAlert({text: `Captions containing '${searchInput}'`, position: 'bottom'}, 5000)
      sendUserAction('filtertrans', { value: searchInput })
      capSearch.toTop()
      handleExpand(true)
    } else {
      searchInCourse()
    }
  }

  const onReset = () => {
    setSearchInput(() => '')
    handleExpand(false)
    setResults(() => [])
  }

  return (
    <div className="tool-bar">
      <div className="search">
        <Select 
          value={searchType} 
          options={searchOptions} 
          onChange={changeSearchType}
        />
        <div className="ui icon input">
          <input 
            type="text" 
            id="caption-search" 
            placeholder="Search Captions"
            value={searchInput}
            onChange={handleOnChange}
            onKeyDown={handleOnKeyDown}
            title={'Search for captions (\u2318/Ctrl + \u21E7 + space)'}
            autoComplete="off"
            disabled={loadingResults}
          />
          <i aria-hidden="true" className="search icon"></i>
        </div>
        {
          canReset
          &&
          <Button className="edit-button" onClick={onReset}>
            Reset
          </Button>
        }
      </div>

      <div className="tool-buttons">
        <DownloadTransButton trans={media.transcriptions} />
        <Popup
          position="left center" inverted
          content={`Expand the transcription area (\u2318/Ctrl + U)`}
          trigger={
            <Button 
              compact
              className="expand-button"
              onClick={handleExpand}
              tabIndex={0}
              title={'Expand the transcription area (\u2318/Ctrl + U)'}
              aria-label="Expand the transcription area"
              icon={<i className="material-icons" id="expand-trigger">expand_less</i>}
            />
          }
        />
      </div>
    </div>
  )
}