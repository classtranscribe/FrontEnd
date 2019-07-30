import React from 'react'
import { Loader } from 'semantic-ui-react'

export default function PlaylistPlaceholder() {
  return (
    <div className="pl-loader">
      <Loader active inline='centered' />
    </div>
  )
}