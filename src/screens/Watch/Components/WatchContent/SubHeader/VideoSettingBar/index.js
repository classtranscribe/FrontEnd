import React, { useState } from 'react'
import ModeSetting from './ModeSetting'
import UpNext from './UpNext'
import './index.css'

export function VideoSettingBar({propsForSettingBar, propsForUpNext}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600 ? true : false)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 600) setIsMobile(() => false)
    else setIsMobile(() => true)
  })

  return (
    <div className="video-setting-bar">
      <ModeSetting {...propsForSettingBar} isMobile={isMobile} />
      <UpNext {...propsForUpNext} isMobile={isMobile} />
    </div>
  )
}
