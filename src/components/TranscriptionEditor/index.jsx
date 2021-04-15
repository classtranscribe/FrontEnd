import React, { useState, useRef, useCallback } from 'react'
import { CTFragment, CTText, CTBrand, CTList, CTModal } from 'layout';
import CTPlayer, {
    CTPlayerConstants as PConstants,
    LanguageConstants as LangConstants
} from 'components/CTPlayer';
import useThrottle from 'hooks/useThrottle'
import cx from 'classnames';
import Timeline from './Timeline'
import { Slider, Button } from '@material-ui/core'
import './index.scss'
import CaptionEditorPanel from './CaptionEditorPanel';
import TimestampInput from './TimestampInput';
import { connect } from 'dva';

function Footer({ scale }) {
    const [mouseDown, setOMD] = useState(false);
    const slideBar = useRef(null);
    const [left, setLeft] = useState(0);
    const w = 100 / (Math.pow(2, scale))
    const onFTDrag = useThrottle((e) => {
        setLeft(Math.max(0, e.clientX - mouseDown))
    }, 80);
    const onMouseUp = useCallback(() => {
        window.removeEventListener('mousemove', onFTDrag)
        window.removeEventListener('mouseup', onMouseUp);
    });
    const oMD = (e) => {
        if (e.button !== 0) {
            return;
        }
        // Register Mouse event
        window.addEventListener('mouseup', onMouseUp)
        window.addEventListener('mousemove', onFTDrag);
        const csl = slideBar.current.parentNode.getBoundingClientRect();
        setOMD(csl.x + e.nativeEvent.offsetX);
    }
    return <div className="footer">
        <div id="scrollbar" slot="primary-footer">
            <ytve-timeline-horizontal-scrollbar {...(true ? {} : { hidden: "true" })}>
                <canvas id="scrollbar-handle"
                    ref={slideBar}
                    onMouseDown={oMD}
                    height="6" className="ct-timeline-horizontal-scrollbar" style={{
                        transform: 'translateX(' + left + 'px)', width: (w + '%'), display: w == 100 ? 'none' : 'block'
                    }}></canvas>
            </ytve-timeline-horizontal-scrollbar>
        </div>
    </div>
}

function TransEditorToolBarL2WR({ dispatch, time, scalelevel }) {
    const onTSChange = (value) => {
        dispatch({ type: 'watch/media_setCurrTime', payload: value });
    }
    const onScaleChange = (e, val) => {
        if (val !== scalelevel) {
            dispatch({ type: 'transeditor/setScaleLevel', payload: val });
        }
    }
    return <ytve-toolbar dir="ltr" className="ct-editor">
        <div id="left-controls" className="ct-toolbar">
            <TimestampInput value={time} onChange={onTSChange} />
            <dom-if className="ct-toolbar"></dom-if>
            <ytcp-button id="undo-button" icon="undo" icon-rtl-flip="" label="撤消" secondary="" track-click="" className="ct-toolbar" tabindex="0" icon-alignment="start" aria-disabled="false" role="button">
                <div className="label ytcp-button"><i className="material-icons">undo</i> Undo</div>
            </ytcp-button>
            <ytcp-button id="redo-button" icon="redo" icon-rtl-flip="" label="重做" secondary="" track-click="" className="ct-toolbar" disabled="" tabindex="-1" icon-alignment="start" aria-disabled="true" role="button">
                <div className="label ytcp-button"><i className="material-icons">redo</i> Redo</div>
            </ytcp-button>
            <dom-if restamp="" className="ct-toolbar"></dom-if>
            <div id="action-buttons" className="ct-toolbar"></div>
        </div>
        <div id="right-controls" className="ct-toolbar">
            <ytcp-icon-button id="zoom-out" aria-label="缩小" icon="icons:zoom-out" tooltip-label="Zoom-Out" track-click="" className="ct-toolbar" tabindex="-1" aria-disabled="true" role="button" disabled="">
                <div className="label ytcp-button"><i className="material-icons">zoom_out</i></div>
            </ytcp-icon-button>
            <Slider marks step={1} min={0} max={4} value={scalelevel} onChange={onScaleChange} className="slider" />
            <ytcp-icon-button id="zoom-in" aria-label="放大" icon="icons:zoom-in" tooltip-label="Zoom-in" track-click="" className="ct-toolbar" tabindex="0" aria-disabled="false" role="button">
                <div className="label ytcp-button"><i className="material-icons">zoom_in</i></div>
            </ytcp-icon-button>
        </div>
        <iron-a11y-keys keys="ctrl+1 meta+1" className="ct-toolbar"></iron-a11y-keys>
        <iron-a11y-keys keys="ctrl++ meta++" className="ct-toolbar"></iron-a11y-keys>
        <iron-a11y-keys keys="ctrl+z meta+z" className="ct-toolbar"></iron-a11y-keys>
        <iron-a11y-keys keys="ctrl+y meta+y" className="ct-toolbar"></iron-a11y-keys>
    </ytve-toolbar>
}
const TransEditorToolBarL2 = connect(({ watch: { time }, transeditor: { scalelevel } }) => ({ time, scalelevel }))(TransEditorToolBarL2WR);

function TranscriptionEditor({ match, scalelevel }) {
    //const { params } = match;
    const params = { id: '5ef34bb6-4e21-49be-aecb-819f23c43905' };
    return (
        <CTModal
            open={true}
            disableBackdropClick
            disableEscapeKeyDown
            fullWidth
            maxWidth='lg'
            container
            transition
            scroll='paper'
            id="cookie-agreement-inner-wrapper"
            className="yttt"
        >
            <div className="header">
                <div className="header-content">
                    <div id="dialog-title">
                        <tp-yt-iron-icon id="dialog-title-icon" icon="av:subtitles">
                            <i className="material-icons">subtitles</i>
                        </tp-yt-iron-icon>
                        <div id="dialog-title-text">Transcription Editor</div>
                    </div>
                    <div slot="secondary-header">
                        <div id="plugin-message"></div>
                        <ytcp-send-feedback-button dialog-name="captions-editor">
                            <ytcp-icon-button icon="icons:feedback" tooltip-label="发送反馈" tabindex="0" aria-disabled="false" aria-label="Send Tip" role="button">
                                <i className="material-icons">feedback</i>
                            </ytcp-icon-button>
                        </ytcp-send-feedback-button>
                        <ytcp-button id="save-draft-button" label="保存草稿" track-click="" tabindex="0" icon-alignment="start" aria-disabled="false" role="button">
                            <dom-if className="ytcp-button"></dom-if>
                            <div className="label ytcp-button">
                                Save Draft
              </div>
                        </ytcp-button>
                        <div id="save-container">
                            <Button
                                variant={'contained'} // isStarred ? 'outlined' : 
                                className={cx('makeStyles-teal-13', 'mb-2')}
                                //startIcon={isStarred ? <StarBorderIcon /> : <StarIcon />}
                                size="large"
                            //onClick={() => onStarAction(!isStarred)}
                            >Publish</Button>
                            <ytcp-icon-button id="close-button" icon="icons:close" tooltip-label="关闭" tabindex="0" aria-disabled="false" aria-label="关闭" role="button">
                                <i className="material-icons">close</i>
                            </ytcp-icon-button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content">
                <div id="content" slot="content">
                    <ytve-editor show-history-controls="" is-split="">
                        <div id="panels" className="ct-editor">
                            <div id="panel-container" className="ct-editor">
                                <CaptionEditorPanel />
                            </div>
                            <ytve-preview-panel id="preview-panel" className="ct-editor">
                                <div id="preview-wrapper" className="ct-preview-panel" style={{ maxHeight: 360 }}>
                                    <CTPlayer
                                        mediaId={params.id}
                                        embedded={true}
                                        defaultOpenCC={false}
                                        fill
                                        hideWrapperOnMouseLeave
                                    // beginAt={parseInt(begin, 10)}
                                    />
                                </div>
                                <div id="preview-cta" className="ct-preview-panel">
                                    <ytve-captions-editor-preview-cta className="ct-preview-panel">
                                        <div id="label" className="ct-captions-editor-preview-cta">
                                            Use
                  <ytcp-anchor href="#" className="ct-captions-editor-preview-cta">
                                                <a id="anchor" className="remove-default-style ytcp-anchor" href="#">
                                                    <dom-if className="ytcp-anchor"></dom-if> <span className="text ytcp-anchor"> Keyboard Shortcut </span>
                                                    <dom-if className="ytcp-anchor"></dom-if> </a>
                                            </ytcp-anchor>for easy input.
                 </div>
                                        <ytcp-checkbox-lit compact="" label="输入时暂停" className="ct-captions-editor-preview-cta" aria-disabled="false" tabindex="0" aria-checked="false" role="checkbox">
                                            <div id="checkbox-container" className="ytcp-checkbox-lit">
                                                <div id="checkbox" className="ytcp-checkbox-lit">
                                                </div>
                                            </div>
                                            <div className="ytcp-checkbox-lit label">
                                                Pause on Input
                  </div>
                                        </ytcp-checkbox-lit>
                                    </ytve-captions-editor-preview-cta>
                                </div>
                            </ytve-preview-panel>
                        </div>
                        <div id="space-divider" className="ct-editor" style={{ touchAction: 'none' }}>
                            <div id="space-divider-top-part" className="ct-editor"></div>
                            <div id="space-divider-line" className="ct-editor"></div>
                            <div id="space-divider-bottom-part" className="ct-editor">
                                <ytcp-icon-button id="workspace-resize-button" aria-label="调整工作区大小" icon="editor:drag-handle" tooltip-label="调整大小" className="ct-editor" tabindex="0" aria-disabled="false" role="button">

                                </ytcp-icon-button>
                            </div>
                        </div>
                        <TransEditorToolBarL2 />
                        <Timeline />
                        <ytve-keyboard-shortcuts className="ct-editor">
                            <iron-a11y-keys keys="space k" className="ct-keyboard-shortcuts"></iron-a11y-keys>
                            <iron-a11y-keys keys="j" className="ct-keyboard-shortcuts"></iron-a11y-keys>
                            <iron-a11y-keys keys="l" className="ct-keyboard-shortcuts"></iron-a11y-keys>
                            <iron-a11y-keys keys="," className="ct-keyboard-shortcuts"></iron-a11y-keys>
                            <iron-a11y-keys keys="." className="ct-keyboard-shortcuts"></iron-a11y-keys>
                            <iron-a11y-keys keys="shift++" className="ct-keyboard-shortcuts"></iron-a11y-keys>
                        </ytve-keyboard-shortcuts>
                        <iron-a11y-keys keys="up" className="ct-editor"></iron-a11y-keys>
                        <iron-a11y-keys keys="down" className="ct-editor"></iron-a11y-keys>
                    </ytve-editor>
                </div>
            </div>
            <Footer scale={scalelevel} />
        </CTModal>
    )
}
export default connect(({ transeditor: { scalelevel } }) => ({ scalelevel }))(TranscriptionEditor);