import { string } from 'prop-types';
import React, { useEffect, useState } from 'react';
import EPubParser from 'screens/EPub/controllers/file-builders/EPubParser';

function Image({ src, ...props }) {
    const [dataUrl, setDataUrl] = useState(null);
    useEffect(() => {
        if (typeof src !== 'string') {
            src = src.default;
        } 
        async function load() {
            const img = await EPubParser.loadImageBuffer(String(src))
            const v = new Blob([img]);
            setDataUrl(URL.createObjectURL(v))
        }
        
        if (!src.startsWith('data:')) {
            load()
        } else {
            setDataUrl(src);
        }
    }, [src])
    return <img src={dataUrl} {...props} />
}

export default Image;