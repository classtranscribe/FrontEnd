import React, { useState, useEffect } from 'react'
import AceEditor from 'react-ace'
import { Button } from 'pico-ui'
import { setup } from 'screens/MediaSettings/Utils'
import "ace-builds/src-noconflict/mode-html"
import "ace-builds/src-noconflict/snippets/html"
import "ace-builds/src-noconflict/theme-monokai"
import "ace-builds/src-noconflict/theme-github"
import "ace-builds/src-min-noconflict/ext-searchbox"
import "ace-builds/src-min-noconflict/ext-language_tools"

export function HTMLEditor({
  text
}) {

  const [fullscreen, setFullscreen] = useState(false)
  const [dark, setDark] = useState(true)

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
      let editorEl = document.getElementById('msp-ee-editor')
      if (editorEl) {
        editorEl.scrollIntoView()
      }
    })
  }, [])

  return (
    <div 
      id="msp-ee-editor" 
      className="msp-ee-editor msp-ee-html-editor-con ct-a-fade-in" 
      data-fullscreen={fullscreen}
      data-dark={dark}
    >
      <div className="ee-editor-ctrl-bar">
        <Button disabled compact 
          color={dark ? "black" : ''} 
          classNames="mr-4" 
          text="HTML Editor"
        />
        <Button round
          classNames="mr-2"
          icon={dark ? 'brightness_7' : 'brightness_4'}
          color={dark ? "black" : ''}
          text={dark ? "Light Mode" : "Dark Mode"} 
          onClick={() => setDark( dark => !dark )}
        />
        <Button round 
          icon={fullscreen ? "fullscreen_exit" : "fullscreen"}
          color={dark ? "black" : ''}
          onClick={fullscreen ? exitFullscreen : enterFullscreen}
        />
      </div>
      <AceEditor
        className="msp-ee-html-editor"
        mode="html"
        theme={dark ? "monokai" : "github"}
        onChange={onChange}
        name="msp-ee-html-editor"
        editorProps={{ $blockScrolling: true }}
        value={text}
        data-scroll
        width="100%"
        height={fullscreen ? "90vh" : "500px"}
        wrapEnabled
        enableLiveAutocompletion
      />
    </div>
  )
}
