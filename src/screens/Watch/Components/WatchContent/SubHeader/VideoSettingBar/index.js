/**
 * Setting bar for screen mode inside SubHeader
 */

import React, { useState, lazy, Suspense } from 'react'
// UI
import './index.css'
const ModeSetting = lazy(() => import('./ModeSetting'))

export function VideoSettingBar({propsForSettingBar}) {
  /** Listen on resizing of window to decide showing or hiding the text */
  const [isMobile, setIsMobile] = useState(window.innerWidth < 650 ? true : false)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 650) setIsMobile(() => false)
    else setIsMobile(() => true)
  })

  return (
    <div className="video-setting-bar">
      <Suspense fallback={<div>Loading...</div>}>
        <ModeSetting {...propsForSettingBar} isMobile={isMobile} />
      </Suspense>
    </div>
  )
}
