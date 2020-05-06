import _ from 'lodash';
import AdmZip from 'adm-zip';

import { load_images_buffers } from './util';

import { KATEX_CSS      } from './statics/katex.min.css.js';
import { STYLE_CSS      } from './statics/html/styles.css.js';
import { INDEX_HTML     } from './statics/html/index.html.js';

async function load_and_add_images(zip, chapters, cover) {
    let { 
        coverBuffer, 
        images, 
    } = await load_images_buffers({ chapters, cover });

    zip.addFile(`cover.jpeg`, coverBuffer);

    _.forEach(images, img => {
        zip.addFile(`images/${img.id}.jpeg`, img.buffer);
    });
}

function get_index_html(title, author, chapters) {
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

    
    return INDEX_HTML(title, nav_contents, content);
}

async function html_converter({ 
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
    let index_html = get_index_html(title, author, chapters);
    zip.addFile('index.html', new Buffer(index_html));

    return zip.toBuffer();
}

export default html_converter;