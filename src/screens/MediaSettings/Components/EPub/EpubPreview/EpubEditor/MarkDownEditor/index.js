import React, { useState, useEffect } from 'react'
import AceEditor from 'react-ace'
import { Button } from 'pico-ui'
import { setup, epub } from 'screens/MediaSettings/Utils'
import "ace-builds/src-noconflict/mode-markdown"
import "ace-builds/src-noconflict/snippets/markdown"

export function MarkDownEditor({
  text
}) {

  const [fullscreen, setFullscreen] = useState(false)
  const [dark, setDark] = useState(false)

  const onChange = newValue => {
    epub.updateText(newValue)
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
          text="Markdown Editor"
        />
        <Button
          classNames="mr-2"
          icon={dark ? 'brightness_7' : 'brightness_4'}
          color={dark ? "black" : 'tranparent'}
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
        mode="markdown"
        theme={dark ? "monokai" : "github"}
        onChange={onChange}
        name="msp-ee-html-editor"
        editorProps={{ $blockScrolling: true }}
        value={text}
        data-scroll
        width="100%"
        height={fullscreen ? "90vh" : "530px"}
        wrapEnabled
        enableLiveAutocompletion
      />
    </div>
  )
}
