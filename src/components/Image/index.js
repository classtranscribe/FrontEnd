import { string } from 'prop-types';
import React, { useEffect, useState } from 'react';
import EPubParser from 'screens/EPub/controllers/file-builders/EPubParser';

function Image({ src, ...props }) {
    const [dataUrl, setDataUrl] = useState(null);
    useEffect(() => {
        async function load() {
            const img = await EPubParser.loadImageBuffer(src)
            const v = new Blob([img]);
            setDataUrl(URL.createObjectURL(v))
        }
        // TODO
        if (typeof src === 'string') {
            if (!src.startsWith('data:')) {
                load()
            } else {
                setDataUrl(src);
            }
        }
    }, [src])
    return <img src={dataUrl} {...props} />
}

export default Image;