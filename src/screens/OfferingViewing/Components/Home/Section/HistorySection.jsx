import React, { useState, useEffect} from 'react'
import { VideoCard } from '../../../../../components'
import { util, api, prompt } from '../../../../../utils'
import { OfferingListHolder } from '../PlaceHolder'

function HistorySection({ 
  offerings 
}) {

  const [watchHistory, setWatchHistory] = useState(['unloaded'])

  const getMediaById = async mediaId => {
    let { data } = await api.getMediaById(mediaId)
    return api.parseMedia(data)
  }

  const getUserWatchHistories = async () => {
    try {
      let { data } = await api.getUserWatchHistories()
      data.filter(me => me.json.ratio < 80)
      console.log(data)
      for (let i = 0; i < data.length; i++) {
        data[i] = await getMediaById(data[i].mediaId)
      }
      setWatchHistory(data)
    } catch (error) {
      setWatchHistory([])
      prompt.addOne({ text: "Couldn't load watch histories.", status: 'error' })
    }
  }

  useEffect(() => {
    getUserWatchHistories()
  }, [])

  return (
    <div className="offerings" id="starred-offerings">
      {
        watchHistory[0] === 'unloaded' ? 
        <OfferingListHolder row={1} title={false} width="220px" />
        :
        watchHistory.map( (media, index) =>  (
          <MediaCard key={media.mediaId + index} media={media} offerings={offerings} />
        ))
      }
    </div>
  )
}

function MediaCard({ media }) {
  const { mediaName, watchHistory, id } = media

  return (
    <VideoCard square
      name={mediaName}
      link={util.links.watch(id)}
      ratio={watchHistory.ratio}
    />
  )
}

export default HistorySection