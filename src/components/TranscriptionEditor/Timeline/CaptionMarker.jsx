import React, { useCallback, useEffect } from 'react'
import { connect } from 'dva'
import useThrottle from 'hooks/useThrottle';

function CaptionMarker({ data, factor, leftoff }) {
    const left = leftoff + data.begin * factor;
    const width = Math.max(data.end - data.begin, 1) * factor;
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
        <ytve-captions-marker marker-type="captions-right" aria-label="" style={{ transform: 'translateX(' + (left + width) + 'px)', visibility: 'visible', opacity: 1, width: 0, cursor: 'ew-resize' }}>
            <div id="touch-area" className="ct-captions-marker"></div>
        </ytve-captions-marker>
        <ytve-captions-marker-container style={{ left, width }}>
            <div id="element" className="ct-captions-marker-container">
                {data.text}</div>
        </ytve-captions-marker-container>
    </>)
}

export default CaptionMarker;