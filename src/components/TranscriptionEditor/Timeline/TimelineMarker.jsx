import React, { useCallback, useState } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import timestr from 'utils/use-time';
import useThrottle from 'hooks/useThrottle';
import './TimelineMarker.scss'

const MARGIN_SIDE = 0;

function TimelineMarker({ dispatch, TLWidth, scaleLen, scalelevel, time, duration, horScroll }) {
    const whole_length = scaleLen[scalelevel];
    const px_sec = whole_length / (TLWidth - MARGIN_SIDE * 2);
    const time_off = duration * horScroll;
    const [left, setTLLeft] = useState(0);
    const [labelTime, setLabelTime] = useState('00:00:00.0')
    const [hovered, setHovered] = useState(false);
    const onTLM = (e) => {
        if (e.target !== e.currentTarget) {
            return false;;
        }
        const offset = e.nativeEvent.offsetX - MARGIN_SIDE;
        setTLLeft(Math.floor((offset) * px_sec * 10) / 10);
        setLabelTime(timestr.toDecimalTimeString(time_off + offset * px_sec));
    };
    const onMET = () => setHovered(true);
    const onMEL = () => setHovered(false);
    const onTMC = (e) => {
        dispatch({ type: 'watch/media_setCurrTime', payload: (time_off + left) });
    }

    // useThrottle(
    return <ytve-timeline-markers className="ct-timeline" style={{ height: 138, width: TLWidth }}
        onClick={onTMC}
        onMouseMove={onTLM}
        onMouseEnter={onMET}
        onMouseLeave={onMEL} >
        <div id="left-bookend" aria-label="时间轴的起点" tabindex="0" className="ct-timeline-markers"></div>
        <div id="right-bookend" aria-label="时间轴的终点" tabindex="0" className="ct-timeline-markers"></div>
        <ytve-playhead
            onMouseEnter={onMEL}
            onMouseLeave={onMET}
            id="playhead" aria-live="polite" tabindex="-1" className="ct-timeline-markers under" aria-label="进度条指针 0:00:00" style={{ transform: `translateX(${time / px_sec + MARGIN_SIDE}px)`, opacity: 1 }} >
            <div id="touch-area" className="ct-playhead"></div>
            <div id="circle" className="ct-playhead"></div>
            <div id="label" className="ct-playhead">
                0:00:00
                </div>
            <div id="line" className="ct-playhead"></div>
        </ytve-playhead>
        <ytve-playhead id="hover-playhead" shadow="" class={"ct-timeline-markers" + (hovered && left >= 0 && left <= whole_length ? " hovered" : "")}
            style={{ transform: `translateX(${left / px_sec + MARGIN_SIDE}px)` }}>
            <div id="touch-area" className="ct-playhead"></div>
            <div id="circle" className="ct-playhead"></div>
            <div id="label" className="ct-playhead">
                {labelTime}
            </div>
            <div id="line" className="ct-playhead"></div>
        </ytve-playhead>
    </ytve-timeline-markers>
}
export default connect(({ transeditor: { TLWidth, scaleLen, scalelevel, horScroll }, watch: { time, duration } }) => ({
    TLWidth, scaleLen, scalelevel, time, duration, horScroll
}))(TimelineMarker);