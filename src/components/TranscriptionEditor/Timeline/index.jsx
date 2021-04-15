import React, { useCallback } from 'react'
import { connect } from 'dva'
import './index.scss'
import useThrottle from 'hooks/useThrottle';

function CaptionMarker({ data, scale, leftoff }) {
    const factor = 10 * (scale + 1);
    const left = leftoff + data.begin * factor;
    const width = Math.max(data.end-data.begin, 1) * factor;
    // selected=""
    const onMove = useThrottle((e) => {
        
    }, 50)
    const onMouseDown = useCallback((e) => {
        window.addEventListener('mousemove', onMove);
    })
    const onMouseUp = useCallback((e) => {
        window.removeEventListener('mousemove', onMove);
    })
    return (<>
        <ytve-captions-marker marker-type="captions-left" aria-label="" style={{ transform: 'translateX(' + left + 'px)', visibility: 'visible', opacity: 1, width: 0, cursor: 'ew-resize' }}>
            <div id="touch-area" className="ct-captions-marker"></div>
        </ytve-captions-marker>
        <ytve-captions-marker marker-type="captions-center" aria-label={data.text} style={{ transform: 'translateX(' + left + 'px)', visibility: 'visible', opacity: 1, width, cursor: 'move' }}>
            <div id="touch-area" className="ct-captions-marker"></div>
        </ytve-captions-marker>
        <ytve-captions-marker marker-type="captions-right" aria-label="" style={{ transform: 'translateX(' + (left + width) + 'px)', visibility: 'visible', opacity: 1, width: 0, cursor: 'ew-resize'}}>
            <div id="touch-area" className="ct-captions-marker"></div>
        </ytve-captions-marker>
        <ytve-captions-marker-container style={{ left, width }}>
            <div id="element" className="ct-captions-marker-container">
                {data.text}</div>
        </ytve-captions-marker-container>
    </>)
}
function Timeline({ dispatch, transcript, scalelevel }) {
    const trans2 = transcript.slice(0, 10);
    return (
        <ytve-timeline dir="ltr" className="ct-editor">
            <div id="header-container" className="ct-timeline">
                <div id="menu-offset" className="ct-timeline"></div>
                <ytve-timeline-header className="no-select ct-timeline">
                    <canvas id="canvas" className="ct-timeline-header" style1="width: 1145px; height: 24px;"></canvas>
                    <ytcp-icon-button id="find-left-button" aria-label="查找进度条指针" icon="image:lens" tooltip-label="跳到进度条指针处" className="ct-timeline-header" tabindex="-1" aria-disabled="false" role="button">
                        <tp-yt-iron-icon className="remove-defaults ytcp-icon-button">
                            <svg viewbox="0 0 24 24" preserveaspectratio="xMidYMid meet" focusable="false" className="tp-yt-iron-icon" style201="pointer-events: none; display: block; width: 100%; height: 100%;">
                                <g className="tp-yt-iron-icon">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" className="tp-yt-iron-icon"></path>
                                </g>
                            </svg>
                        </tp-yt-iron-icon>
                    </ytcp-icon-button>
                    <ytcp-icon-button id="find-right-button" aria-label="查找进度条指针" icon="image:lens" tooltip-label="跳到进度条指针处" className="ct-timeline-header" tabindex="-1" aria-disabled="false" role="button">
                        <tp-yt-iron-icon className="remove-defaults ytcp-icon-button">
                            <svg viewbox="0 0 24 24" preserveaspectratio="xMidYMid meet" focusable="false" className="tp-yt-iron-icon" style201="pointer-events: none; display: block; width: 100%; height: 100%;">
                                <g className="tp-yt-iron-icon">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" className="tp-yt-iron-icon"></path>
                                </g>
                            </svg>
                        </tp-yt-iron-icon>
                    </ytcp-icon-button>
                </ytve-timeline-header>
            </div>
            <div id="scroll-area" className="ct-timeline">
                <div id="plugin-timeline-surface" className="ct-timeline">
                    <ytve-captions-editor-timeline id="CAPTIONS" className="ct-timeline">
                        <ytve-timeline-base icon="av:subtitles" label="字幕" className="ct-captions-editor-timeline" active="">
                            <div className="header ct-timeline-base">
                                <i className="material-icons">subtitles</i>
                                <ytcp-paper-tooltip position="bottom" type="label" className="ct-timeline-base">
                                    <ytcp-paper-tooltip-placeholder className="ytcp-paper-tooltip" disable-upgrade="" role="tooltip" id="goog_954152144">
                                        <div id="slot-wrapper" className="ytcp-paper-tooltip"></div>
                                        <div id="tooltip-placeholder-fake-slot" className="ytcp-paper-tooltip">
                                            字幕
                     </div>
                                        <dom-if className="ytcp-paper-tooltip"></dom-if>
                                    </ytcp-paper-tooltip-placeholder>
                                </ytcp-paper-tooltip>
                                <dom-if restamp="" className="ct-timeline-base"></dom-if>
                                <dom-if restamp="" className="ct-timeline-base"></dom-if>
                                <div className="header-expanded ct-timeline-base"></div>
                            </div>
                            <div id="captions-timeline-content" slot="content" className="ct-captions-editor-timeline">
                                <div className="captions-row-container ct-captions-editor-timeline">
                                    <div id="captions-row" className="ct-captions-editor-timeline" style={{ left: 24, width: 1097 }}></div>
                                    <div id="decorations" className="no-select ct-captions-editor-timeline">
                                        {
                                            trans2.map((k) => <CaptionMarker data={k} leftoff={10} scale={scalelevel} />)
                                        }
                                    </div>
                                </div>
                            </div>
                        </ytve-timeline-base>
                    </ytve-captions-editor-timeline>
                    <ytve-audio-editor-timeline id="AUDIO_WAVEFORM" className="ct-timeline">
                        <ytve-timeline-base icon="image:music-note" label="音频" className="ct-audio-editor-timeline">
                            <div className="header ct-timeline-base">
                                <i className="material-icons">audiotrack</i>
                                <ytcp-paper-tooltip position="bottom" type="label" className="ct-timeline-base">
                                    <ytcp-paper-tooltip-placeholder className="ytcp-paper-tooltip" disable-upgrade="" role="tooltip" id="goog_954152145">
                                        <div id="slot-wrapper" className="ytcp-paper-tooltip"></div>
                                        <div id="tooltip-placeholder-fake-slot" className="ytcp-paper-tooltip">
                                            音频
                     </div>
                                        <dom-if className="ytcp-paper-tooltip"></dom-if>
                                    </ytcp-paper-tooltip-placeholder>
                                </ytcp-paper-tooltip>
                                <dom-if restamp="" className="ct-timeline-base"></dom-if>
                                <dom-if restamp="" className="ct-timeline-base"></dom-if>
                                <div className="header-expanded ct-timeline-base"></div>
                            </div>
                            <div id="audio-timeline-content" slot="content" className="ct-audio-editor-timeline">
                                <paper-spinner-lite active="" className="ct-audio-editor-timeline" hidden="true">
                                    <div id="spinnerContainer" className="active  paper-spinner-lite">
                                        <div className="spinner-layer paper-spinner-lite">
                                            <div className="circle-clipper left paper-spinner-lite">
                                                <div className="circle paper-spinner-lite"></div>
                                            </div>
                                            <div className="circle-clipper right paper-spinner-lite">
                                                <div className="circle paper-spinner-lite"></div>
                                            </div>
                                        </div>
                                    </div>
                                </paper-spinner-lite>
                                <ytve-audio-waveform className="ct-audio-editor-timeline">
                                    <canvas id="audio-waveform" className="no-select ct-audio-waveform" height="48" width="1145" style201="height: 48px; width: 1145px;"></canvas>
                                </ytve-audio-waveform>
                            </div>
                        </ytve-timeline-base>
                    </ytve-audio-editor-timeline>
                </div>
            </div>
            <ytve-timeline-markers className="ct-timeline" style={{ height: 138, width: 1145 }}>
                <div id="left-bookend" aria-label="时间轴的起点" tabindex="0" className="ct-timeline-markers"></div>
                <div id="right-bookend" aria-label="时间轴的终点" tabindex="0" className="ct-timeline-markers"></div>
                <ytve-playhead id="playhead" aria-live="polite" tabindex="-1" className="ct-timeline-markers under" aria-label="进度条指针 0:00:00" style201="transform: translateX(24px); opacity: 1;">
                    <div id="touch-area" className="ct-playhead"></div>
                    <div id="circle" className="ct-playhead"></div>
                    <div id="label" className="ct-playhead">
                        0:00:00
                </div>
                    <div id="line" className="ct-playhead"></div>
                </ytve-playhead>
                <ytve-playhead id="hover-playhead" shadow="" className="ct-timeline-markers" style201="transform: translateX(304px);">
                    <div id="touch-area" className="ct-playhead"></div>
                    <div id="circle" className="ct-playhead"></div>
                    <div id="label" className="ct-playhead">
                        0:35:29
                </div>
                    <div id="line" className="ct-playhead"></div>
                </ytve-playhead>
            </ytve-timeline-markers>
        </ytve-timeline>

    )
}

export default connect(({ watch: { transcript }, transeditor: { scalelevel } }) => ({ transcript, scalelevel }))(Timeline);