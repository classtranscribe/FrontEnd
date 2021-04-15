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
        load()
    }, [src])
    return <img src={dataUrl} {...props} />
}

export default Image;