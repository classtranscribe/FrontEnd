import _ from 'lodash';
import AdmZip from 'adm-zip';

import { load_images_buffers } from './util';

import { KATEX_CSS          } from './statics/katex.min.css.js';
import { STYLE_CSS          } from './statics/html/styles.css.js';
import { LOCAL_INDEX_HTML   } from './statics/html/index.local.html.js';
import { LIVE_INDEX_HTML    } from './statics/html/index.live.html.js';

async function load_and_add_images(zip, chapters, cover) {
    let { 
        coverBuffer, 
        images, 
    } = await load_images_buffers({ chapters, cover });

    zip.addFile(`images/cover.jpeg`, coverBuffer);

    _.forEach(images, img => {
        zip.addFile(`images/${img.id}.jpeg`, img.buffer);
    });
}

function get_index_html({
    title, 
    author, 
    chapters, 
    withStyles=false, 
    print=false,
    cover
}) {
    let nav_contents = _.map(chapters, (ch, chIndex) => `
                    <h3><a href="#${ch.id}">${chIndex + 1} - ${ch.title}</a></h3>
                    <ol>
                        ${_.map(
                            ch.subChapters, 
                            (subch, subIndex) => 
                            `<li><a href="#${subch.id}">${chIndex + 1}.${subIndex + 1} - ${subch.title}</a></li>`
                        ).join('\n\t\t\t\t\t\t')}
                    </ol>
    `).join('\n\t\t\t\t\t');

    let content = _.map(chapters, ch => `
            <div class="ee-preview-text-con">
                ${ch.text.split('\n').join('\n\t\t\t\t')}
            </div>
    `).join('\n\t\t\t');

    
    return withStyles
            ? LIVE_INDEX_HTML({ title, nav_contents, content, cover, author, print })
            : LOCAL_INDEX_HTML({ title, nav_contents, content, author });
}

export async function html_converter({ 
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

    // cover.jpeg
    // images/image-id.jpeg
    await load_and_add_images(zip, chapters, cover);

    // styles
    // styles/style.css
    zip.addFile('styles/style.css', new Buffer(STYLE_CSS));
    // styles/katex.min.css
    zip.addFile('styles/katex.min.css', new Buffer(KATEX_CSS));

    // index.html
    let index_html = get_index_html({ title, author, chapters });
    zip.addFile(filename + '.html', new Buffer(index_html));

    return zip.toBuffer();
}

export function html_previewer({
    title, 
    author, 
    language, 
    filename, 
    chapters, 
    cover
}, print=true) {
    let html = get_index_html({
        title, 
        author, 
        chapters, 
        withStyles: true, 
        print, 
        cover
    });

    let htmlBlob = new Blob([html], { type: 'text/html' });
    let htmlUrl = URL.createObjectURL(htmlBlob);
    window.open(htmlUrl, '_blank');
}