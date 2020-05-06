import _ from 'lodash';
import AdmZip from 'adm-zip';
import { dedent } from 'dentist';

import { load_images_buffers } from './util';

import { KATEX_CSS        } from './statics/katex.min.css.js';
import { OEBPS_STYLE_CSS        } from './statics/epub/style.css.js';
import { META_INF_CONTAINER_XML } from './statics/epub/container.xml.js';
import { MIMETYPE               } from './statics/epub/mimetype.js';
import { OEBPS_TOC_NCX          } from './statics/epub/toc.ncx.js';
import { OEBPS_TOC_XHTML        } from './statics/epub/toc.xhtml.js';
import { OEBPS_CONTENT_OPF      } from './statics/epub/content.opf.js';
import { OEBPS_CONTENT_XHTML    } from './statics/epub/content.xhtml.js';



async function load_and_add_images(zip, chapters, cover) {
    let { 
        coverBuffer, 
        images, 
    } = await load_images_buffers({ chapters, cover });

    zip.addFile(`OEBPS/cover.jpeg`, coverBuffer);

    _.forEach(images, img => {
        zip.addFile(`OEBPS/images/${img.id}.jpeg`, img.buffer);
    });
}

function get_toc_ncx(title, author, chapters) {
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

function get_toc_xhtml(title, language, chapters) {
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

function get_content_opf(
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

function get_content_xhtml(chapter, language) {
    let { title, text } = chapter;

    let content = dedent(`
        <div class="ee-preview-text-con">
            ${text}
        </div>
    `);

    return OEBPS_CONTENT_XHTML(title, content, language);
}

async function epub_converter({ 
    title, 
    author, 
    language, 
    filename, 
    chapters, 
    cover 
}) {
    if (!filename || !chapters || !title) {
        throw Error('filename, title, and chapters are required.');
    }

    const zip = new AdmZip();

    // OEBPS/cover.jpeg
    // OEBPS/images/image-id.jpeg
    await load_and_add_images(zip, chapters, cover);

    // mimetype
    zip.addFile('mimetype', new Buffer(MIMETYPE));

    // META-INF/container.xml
    zip.addFile('META-INF/container.xml', new Buffer(META_INF_CONTAINER_XML));

    // OEBPS
    // OEBPS/style.css
    zip.addFile('OEBPS/style.css', new Buffer(OEBPS_STYLE_CSS));
    // OEBPS/katex.min.css
    zip.addFile('OEBPS/katex.min.css', new Buffer(KATEX_CSS));

    // OEBPS/toc.ncx
    let tox_ncx = get_toc_ncx(title, author, chapters);
    zip.addFile('OEBPS/toc.ncx', new Buffer(tox_ncx));

    // OEBPS/toc.xhtml
    let toc_xhtml = get_toc_xhtml(title, language, chapters);
    zip.addFile('OEBPS/toc.xhtml', new Buffer(toc_xhtml));
    
    // OEBPS/content.opf
    let content_opf = get_content_opf(title, author, language, 'ClassTranscribe', new Date(), chapters);
    zip.addFile('OEBPS/content.opf', new Buffer(content_opf));

    // OEBPS/chapter-id.xhtml
    _.forEach(chapters, ch => {
        let content_xhtml = get_content_xhtml(ch, language);
        zip.addFile(`OEBPS/${ch.id}.xhtml`, new Buffer(content_xhtml));
    });

    return zip.toBuffer();
}

export default epub_converter;