import _ from 'lodash';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export function parse_chapters(chapters, replaceSrc=true) {
    return _.map(chapters, chapter => {;
        let html = chapter.text;
        // Remove invalid syntax for xhtml
        html = _.replace(html, /&nbsp;/g, '&#160;');
        html = _.replace(html, /<br>/g, '<br/>');

        let doc = new DOMParser().parseFromString(html, 'text/html');

        // get all images from html
        let imgEls = doc.getElementsByTagName('img');
        let images = _.map(
            imgEls, 
            imgEl => {
                let src = imgEl.src;
                let imgID = 'img-' + uuidv4();
                if (replaceSrc) {
                    imgEl.src = `images/${imgID}.jpeg`;
                }
                
                return { src, id: imgID };
            }
        );

        // Serialize xhtml
        let xhtml = new XMLSerializer().serializeToString(doc);

        // only keep codes inside the <body>..</body>
        xhtml = xhtml.replace('<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>', '');
        xhtml = xhtml.replace('</body></html>', '');

        return {
            id: chapter.id,
            title: chapter.title,
            text: xhtml,
            images,
            subChapters: chapter.subChapters
        };
    });
}

export async function load_images_buffers({
    cover,
    chapters
}) {
    let coverResp = await axios.get(cover, { responseType: 'arraybuffer' });
    let coverBuffer = new Buffer(coverResp.data);

    let images = [];
    for(let i = 0; i < chapters.length; i++) {
        let ch = chapters[i];
        if (ch.images) {
            for (let j = 0; j < ch.images.length; j++) {
                let img = ch.images[j];

                let { data } = await axios.get(img.src, { responseType: 'arraybuffer' });
                images.push({
                    ...img,
                    buffer: new Buffer(data)
                })
            }
        }
    }

    return {
        coverBuffer,
        images
    }
}