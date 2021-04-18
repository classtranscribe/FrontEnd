import React, { useEffect, useState } from 'react'
import moment from 'moment';
import timestr from 'utils/use-time';
import TextField from '@material-ui/core/TextField';
// import './index.scss'

function TimestampInput({ value, onFocus, onChange }) {
    const [tvalue, setTValue] = useState(timestr.toDecimalTimeString(value));
    const [error, setError] = useState(false);
    const onChange_Internal = (val) => {
        const value = val.target.value;
        setTValue(value)
    }
    const onTBlur = () => {
        const t = timestr.toDecimalSeconds(tvalue)
        setError(isNaN(t));
        !isNaN(t) && onChange && onChange(t);
    }
    const onFocusE = (e) => {
        const t = timestr.toDecimalSeconds(tvalue)
        !isNaN(t) && onFocus && onFocus(t);
    }
    useEffect(() => {
        setTValue(timestr.toDecimalTimeString(value))
    },[value])
    return <ytcp-media-timestamp-input tiny="" className="ct-toolbar" dir="ltr">
        <TextField variant="outlined" size="small"
            error={error}
            onChange={onChange_Internal}
            onFocus={onFocusE}
            onBlur={onTBlur}
            value={tvalue} />
        <ytcp-form-error-tip anchor-selector="#container" className="ytcp-media-timestamp-input" position="top" hidden="">
            <div id="message" aria-role="alert" aria-live="polite" className="ytcp-form-error-tip">
            </div>
            <div id="tail" className="ytcp-form-error-tip"></div>
        </ytcp-form-error-tip>
        <ytcp-paper-tooltip id="timestamp-tooltip" for="container" position="bottom" type="descriptive-standard" className="ytcp-media-timestamp-input">
            <ytcp-paper-tooltip-placeholder className="ytcp-paper-tooltip" disable-upgrade="" role="tooltip" id="goog_954152146">
                <div id="slot-wrapper" className="ytcp-paper-tooltip"></div>
                <div id="tooltip-placeholder-fake-slot" className="ytcp-paper-tooltip">
                    分钟 : 秒 : 帧
</div>
                <dom-if className="ytcp-paper-tooltip"></dom-if>
            </ytcp-paper-tooltip-placeholder>
        </ytcp-paper-tooltip>
    </ytcp-media-timestamp-input>

}
export default TimestampInput;