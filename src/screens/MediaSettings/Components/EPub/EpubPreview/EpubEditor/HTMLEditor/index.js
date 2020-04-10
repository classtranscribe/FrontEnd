import React, { useState, useEffect } from 'react'
import AceEditor from 'react-ace'
import { Button } from 'pico-ui'
import "ace-builds/src-noconflict/mode-html"
import "ace-builds/src-noconflict/theme-monokai"
import { setup } from 'screens/MediaSettings/Utils'

export function HTMLEditor({
  text
}) {

  const [fullscreen, setFullscreen] = useState(false)

  const onChange = (newValue) => {
    console.log("change", newValue);
  }

  const enterFullscreen = () => {
    if (!fullscreen) {
      setup.enterFullscreen('msp-ee-editor')
    }
  }

  const exitFullscreen = () => {
    if (fullscreen) {
      setup.exitFullscreen()
    }
  }

  useEffect(() => {
    document.addEventListener('fullscreenchange', () => {
      setFullscreen(fullscreen => !fullscreen)
    }, true)
  }, [])

  return (
    <div id="msp-ee-editor" className="msp-ee-editor msp-ee-html-editor-con" data-fullscreen={fullscreen}>
      <div className="ee-editor-ctrl-bar">
        <Button disabled compact color="black" classNames="mr-4" >HTML Editor</Button>
        <Button 
          round 
          icon={fullscreen ? "fullscreen_exit" : "fullscreen"}
          color="black" 
          onClick={fullscreen ? exitFullscreen : enterFullscreen}
        />
      </div>
      <AceEditor
        className="msp-ee-html-editor"
        mode="html"
        theme="monokai"
        onChange={onChange}
        name="msp-ee-html-editor"
        editorProps={{ $blockScrolling: true }}
        value={text}
        data-scroll
        width="100%"
        height={fullscreen ? "90vh" : "500px"}
        wrapEnabled
      />
    </div>
  )
}
