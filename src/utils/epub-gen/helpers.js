import _ from 'lodash';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { dedent } from 'dentist';

import { OEBPS_TOC_NCX        } from './statics/toc.ncx.js';
import { OEBPS_TOC_XHTML      } from './statics/toc.xhtml.js';
import { OEBPS_CONTENT_OPF    } from './statics/content.opf.js';
import { OEBPS_CONTENT_XHTML  } from './statics/content.xhtml.js';
import { EDITOR_TYPE_SPLITTER } from 'screens/MediaSettings/Utils/epub/constants';
// import { getImageUrl, } from 'screens/MediaSettings/Utils/epub/util';

export function parse_chapters(chapters) {
    return _.map(chapters, chapter => ({
        ...chapter,
        imageId: 'img-' + uuidv4(),
        image: chapter.image
    }));
}

export async function load_and_add_images(zip, chapters, cover) {
    let coverResp = await axios.get(cover, { responseType: 'arraybuffer' });
    zip.addFile(`OEBPS/cover.jpeg`, new Buffer(coverResp.data));

    for(let i = 0; i < chapters.length; i++) {
        let ch = chapters[i];
        if (ch.image) {
            let { data } = await axios.get(ch.image, { responseType: 'arraybuffer' });
            zip.addFile(`OEBPS/images/${ch.imageId}.jpeg`, new Buffer(data));
        }
    }
}

export function get_toc_ncx(title, author, chapters) {
    let nav_points = '';
    let playOrder = 0;

    const getPlayOrder = () => {
        playOrder += 1;
        return playOrder;
    }

    _.forEach(chapters, (ch, index) => {
        nav_points += `
        <navPoint id="${ch.id}" playOrder="${getPlayOrder()}" class="chapter">
            <navLabel>
                <text>${index + 1} - ${ch.title}</text>
            </navLabel>
            <content src="${ch.id}.xhtml"/>

            ${
                _.map(ch.subChapters, (subCh, subIndex) => `
            <navPoint id="${subCh.id}" playOrder="${getPlayOrder()}">
                <navLabel>
                    <text>${index + 1}.${subIndex + 1} - ${subCh.title}</text>
                </navLabel>
                <content src="${ch.id}.xhtml#${subCh.id}" />
            </navPoint>`).join('\n\t\t\t\t')
            }
        </navPoint>
        `
    });

    return OEBPS_TOC_NCX(title, author, nav_points);
}

export function get_toc_xhtml(title, language, chapters) {
    let nav_contents = '';
    _.forEach(chapters, (ch, index) => {
        nav_contents += `
        <dt class="table-of-content">
            <a href="${ch.id}.xhtml">${index + 1} - ${ch.title}</a>
        </dt>
        ${
            _.map(ch.subChapters, (subCh, subIndex) => `
            <dd>
                <a href="${ch.id}.xhtml#${subCh.id}">
                    ${index + 1}.${subIndex + 1} - ${subCh.title}
                </a>
            </dd>`).join('\n\t\t\t')
        }
        `
    });

    return OEBPS_TOC_XHTML(title, language, nav_contents);
}

export function get_content_opf(
    title, 
    author, 
    language, 
    publisher,
    date, 
    chapters
) {
    let image0ID = `OEBPS/cover.jpeg`;
    // items
    let content_items = _.map(chapters, ch => `<item id="${ch.id}" href="${ch.id}.xhtml" media-type="application/xhtml+xml" />`)
                         .join('\n\t\t');
  // itemrefs
    let content_items_refs = _.map(chapters, ch => `<itemref idref="${ch.id}"/>`)
                              .join('\n\t\t');

    return OEBPS_CONTENT_OPF(
        title, author, 
        language, 
        publisher, 
        date, 
        image0ID, 
        content_items, 
        content_items_refs
    );
}

function html2xhtml(html) {
    if (!html) return null;
    html = _.replace(html, /&nbsp;/g, '&#160;');
    html = _.replace(html, /<br>/g, '<br/>');

    var doc = new DOMParser().parseFromString(html, 'text/html');
    let xhtml = new XMLSerializer().serializeToString(doc);

    // only keep codes inside the <body>
    xhtml = xhtml.replace('<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>', '');
    xhtml = xhtml.replace('</body></html>', '');

    return xhtml;
}

export function get_content_xhtml(chapter, language) {
    let { title, text } = chapter;

    text = html2xhtml(text);

    let content = dedent(`
        <div class="ee-preview-text-con">
            ${text}
        </div>
    `);

    return OEBPS_CONTENT_XHTML(title, content, language);
}