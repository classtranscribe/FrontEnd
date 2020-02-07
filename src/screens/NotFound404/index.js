import React, { useEffect } from 'react'
import { ClassTranscribeHeader } from 'components'
import { Link } from 'react-router-dom'
import { api, util } from 'utils'
import './index.scss'

export function NotFound404({ history }) {

  useEffect(() => {
    api.contentLoaded(100)
  }, [history])
  
  return (
    <div className="nf-bg">
      <div className="nf-con">
        <ClassTranscribeHeader fixed={false} />

        <div className="nf-texts">
          <div className="nf-text-t">
            <strong>ERROR: 404. </strong>
            Couldn't find the page.
          </div>

          <div className="nf-text-d">
            The requested URL was not found on this server.
          </div>

          <div className="nf-links">
            {/* <Link to={}>GO BACK</Link> */}
            <Link to={util.links.home()}>GO TO HOMEPAGE</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
