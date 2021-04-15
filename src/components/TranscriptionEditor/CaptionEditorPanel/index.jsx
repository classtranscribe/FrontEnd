import React, { useEffect, useState, useRef } from 'react'
import TextField from '@material-ui/core/TextField';
import { connect } from 'dva';
import moment from 'moment'
import TimestampInput from '../TimestampInput';
import './index.scss'
function CaptionLine({ dispatch, onInsertAfter, removeCurrent, data, selected = false }) {
    console.log('Caption Line')
    const [hover, setHover] = useState(false);
    const [i_selected, setSelected] = useState(false);
    const [rand, setRand] = useState(0);
    const onKU = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            onInsertAfter && onInsertAfter();
        } else if (e.keyCode === 8 && data.text === '') {
            e.preventDefault();
            removeCurrent && removeCurrent()
        }
    }
    const setTime = (i, val) => {
        const v = i == 1 ? 'begin' : 'end';
        data[v] = val;
        setRand(Math.random());
    }
    const onSubChange = (val) => {
        data.text = val.target.value;
        setRand(Math.random());
    }
    const onTSIFocus = (value) => {
        dispatch({ type: 'watch/media_setCurrTime', payload: value });
    }
    const inputRef = useRef(null);
    useEffect(() => {
        selected && inputRef.current.focus()
        setSelected(selected)
    }, [selected])
    return (
        <ytve-captions-editor-caption-segment-line
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onFocus={() => setSelected(true)}
            onBlur={() => setSelected(false)}
            className="ct-captions-editor-options-panel" style201="z-index: 1000000; transform: translate3d(0px, 0px, 0px);" is-editing-enabled {...(i_selected && { selected })}>
            <div className="no-background ct-captions-editor-caption-segment-line"></div>
            <div id="container" className="ct-captions-editor-caption-segment-line">
                <div id="row-container" className={"ct-captions-editor-caption-segment-line" + (hover ? ' row-highlighted' : '')}>
                    {
                        true ? null : <ytcp-icon-button id="add-segment-before-button" icon="icons:add-circle" tooltip-label="添加一行字幕" className="ct-captions-editor-caption-segment-line" tabindex="0" aria-disabled="false" aria-label="添加一行字幕" role="button">
                            <tp-yt-iron-icon className="remove-defaults ytcp-icon-button">
                                <i className="material-icons">add_circle</i>
                            </tp-yt-iron-icon>
                        </ytcp-icon-button>
                    }
                    <div className="original-text ct-captions-editor-caption-segment-line">
                    </div>
                    <div className="segment ct-captions-editor-caption-segment-line">
                        <div className="segment-text ct-captions-editor-caption-segment-line">
                            <TextField
                                value={data.text}
                                variant="outlined"
                                size="small"
                                multiline
                                rows={4}
                                fullWidth
                                onChange={onSubChange}
                                onKeyDown={onKU}
                                inputRef={inputRef}
                            />
                        </div>
                        <div id="delete-segment-button-container" className="ct-captions-editor-caption-segment-line">
                            <ytcp-icon-button
                                id="delete-segment-button"
                                icon="icons:delete"
                                tooltip-label="移除字幕行"
                                className="ct-captions-editor-caption-segment-line"
                                tabindex="0" aria-disabled="false"
                                aria-label="移除字幕行" role="button"
                                onClick={removeCurrent}>
                                <tp-yt-iron-icon className="remove-defaults ytcp-icon-button">
                                    <i className="material-icons">delete</i>
                                </tp-yt-iron-icon>
                            </ytcp-icon-button>
                        </div>
                        <div className="segment-timings-container ct-captions-editor-caption-segment-line">
                            <div className="segment-start-time ct-captions-editor-caption-segment-line">
                                <TimestampInput value={data.begin}
                                    onChange={(val) => setTime(1, val)} onFocus={onTSIFocus} />
                            </div>
                            <div className="segment-end-time ct-captions-editor-caption-segment-line">
                                <TimestampInput value={data.end} onChange={(val) => setTime(2, val)} onFocus={onTSIFocus} />
                            </div>
                        </div>
                    </div>
                    <ytcp-icon-button
                        id="add-segment-after-button"
                        icon="icons:add-circle"
                        tooltip-label="添加一行字幕"
                        className="ct-captions-editor-caption-segment-line"
                        tabindex="0" aria-disabled="false" aria-label="添加一行字幕"
                        onClick={() => onInsertAfter()}
                        role="button">
                        <tp-yt-iron-icon className="remove-defaults ytcp-icon-button">
                            <i className="material-icons">add_circle</i>
                        </tp-yt-iron-icon>
                        <paper-ripple class="circle style-scope ytcp-icon-button">
                            <div id="background" class="style-scope paper-ripple"></div>
                            <div id="waves" class="style-scope paper-ripple"></div>
                        </paper-ripple>
                    </ytcp-icon-button>
                </div>
            </div>
        </ytve-captions-editor-caption-segment-line>
    )
}
function CaptionEditorPanel({ dispatch, transcript }) {
    const [captions, setCaptions] = useState([])
    const [selectI, setSelected] = useState(0);
    const onInsAfter = (i,) => {
        // TODO : DETERMINE TIME
        captions.splice(i + 1, 0, { text: '' })
        setCaptions([...captions]);
        setSelected(i + 1)
    }
    const onRemoveCurrent = (i) => {
        captions.splice(i, 1)
        setCaptions([...captions]);
        selectI == i && setSelected(Math.max(0, i - 1))
    }
    useEffect(() => {
        setCaptions(transcript.slice(0, 10).map((k) => {
            const t1 = moment().startOf('day');
            k.begin = moment(k.begin, 'HH:mm:ss').diff(t1, 'seconds');
            k.end = moment(k.end, 'HH:mm:ss').diff(t1, 'seconds');
            return k;
        }));
    }, [transcript])
    return (<ytve-captions-editor-options-panel className="ct-editor" with-timing="">
        <div className="options-header ct-captions-editor-options-panel">
            <div className="options-header-left ct-captions-editor-options-panel">
                <dom-if restamp="" className="ct-captions-editor-options-panel"></dom-if>
                <ytcp-button id="add-segment-button" icon="icons:add" icon-alignment="left" label="字幕" className="ct-captions-editor-options-panel" tabindex="0" aria-disabled="false" role="button">
                    <i className="material-icons">add</i> Caption
            </ytcp-button>

                <div className="automatic-timing-switch ct-captions-editor-options-panel">
                    <ytcp-paper-tooltip alignment="start" for="automatic-timing-toggle-container" position="top" type="explanatory" className="ct-captions-editor-options-panel">
                        <ytcp-paper-tooltip-placeholder className="ytcp-paper-tooltip" disable-upgrade="" role="tooltip" id="goog_954152152">
                            <div id="slot-wrapper" className="ytcp-paper-tooltip"></div>
                            <div id="tooltip-placeholder-fake-slot" className="ytcp-paper-tooltip">
                                此语言不支持自动同步时间。
                        </div>
                        </ytcp-paper-tooltip-placeholder>
                    </ytcp-paper-tooltip>
                </div>
            </div>
            <div className="options-header-right ct-captions-editor-options-panel">
                <div className="automatic-timing-switch ct-captions-editor-options-panel">
                    <ytcp-paper-tooltip alignment="start" for="automatic-timing-toggle-container" position="top" type="explanatory" className="ct-captions-editor-options-panel">
                        <ytcp-paper-tooltip-placeholder className="ytcp-paper-tooltip" disable-upgrade="" role="tooltip" id="goog_954152153">
                            <div id="slot-wrapper" className="ytcp-paper-tooltip"></div>
                            <div id="tooltip-placeholder-fake-slot" className="ytcp-paper-tooltip">
                                此语言不支持自动同步时间。
</div>
                            <dom-if className="ytcp-paper-tooltip"></dom-if>
                        </ytcp-paper-tooltip-placeholder>
                    </ytcp-paper-tooltip>
                    <dom-if restamp="" className="ct-captions-editor-options-panel"></dom-if>
                    <div id="automatic-timing-toggle-container" className="ct-captions-editor-options-panel" aria-describedby="goog_954152152 goog_954152153">
                        <dom-if restamp="" className="ct-captions-editor-options-panel"></dom-if>
                        <ytcp-button id="toggle-button" label="以文本形式修改" track-click="" className="ct-captions-editor-options-panel" disabled="" tabindex="-1" icon-alignment="start" aria-disabled="true" role="button">
                            <dom-if className="ytcp-button"></dom-if>
                            <div className="label ytcp-button">
                                Text-Edit Mode
</div>
                        </ytcp-button>
                        <dom-if restamp="" className="ct-captions-editor-options-panel"></dom-if>
                    </div>
                </div>
                <ytcp-icon-button id="more-actions-menu" compact="" icon="more_vert" tooltip-label="选项" className="ct-captions-editor-options-panel" tabindex="0" aria-disabled="false" aria-label="选项" role="button">
                    <i className="material-icons">more_vert</i>
                </ytcp-icon-button>
                <dom-if restamp="" className="ct-captions-editor-options-panel"></dom-if>
            </div>
        </div>
        <dom-if restamp="" className="ct-captions-editor-options-panel"></dom-if>
        <div id="editing-container" className="scrollable-options ct-captions-editor-options-panel">
            <dom-if restamp="" className="ct-captions-editor-options-panel"></dom-if>
            <dom-if restamp="" className="ct-captions-editor-options-panel"></dom-if>
            <tp-yt-iron-list as="segment" scroll-target="editing-container" className="ct-captions-editor-options-panel">
                <array-selector id="selector" className="tp-yt-iron-list"></array-selector>
                <div id="items" className="tp-yt-iron-list">
                    {
                        captions.map((v, i) => {
                            return <CaptionLine onInsertAfter={() => onInsAfter(i)}
                                dispatch={dispatch}
                                selected={selectI === i}
                                data={v}
                                removeCurrent={() => onRemoveCurrent(i)}
                                onSelected={(d) => setSelected(i)} />
                        })
                    }
                </div>
            </tp-yt-iron-list>
            <dom-if restamp="" className="ct-captions-editor-options-panel"></dom-if>
            <dom-if restamp="" className="ct-captions-editor-options-panel"></dom-if>
            <dom-if restamp="" className="ct-captions-editor-options-panel"></dom-if>
            <dom-if restamp="" className="ct-captions-editor-options-panel"></dom-if>
        </div>
    </ytve-captions-editor-options-panel>
    )
}

export default connect(({ watch: { transcript } }) => ({ transcript }))(CaptionEditorPanel);