import _ from 'lodash';
import { EDITOR_TYPE_SPLITTER, EDITOR_MARKDOWN, SUB_CHAPTER_ID_PREFIX } from './constants';
import { html, api } from 'utils';
// import { openCoverImagePicker } from './chapter-spiltter';

export function parseText(text) {
    let splittedTexts = _.split(text, EDITOR_TYPE_SPLITTER);
    let content = splittedTexts[0];
    let editorType = splittedTexts[1];

    return { content, editorType };
}

export function markdown2HTML(text) {
    return html.markdown(text);
}

export function chapterToHTML({ items, subChapters, image }) {
    let chapterHTML = (image ? `<img src="${api.getMediaFullPath(image)}" />\n\n` : '')
                    + html.strList(items, 'text');

    let subChapterHTML = _.reduce(
        subChapters,
        (subHtml, subChapter) => subHtml 
            + `\n\n<h3 id="${SUB_CHAPTER_ID_PREFIX}-${subChapter.id}">${subChapter.title}</h3>\n\n`
            + `<img src="${api.getMediaFullPath(subChapter.image)}" />\n\n`
            + html.strList(subChapter.items, 'text')
        ,
        ''
    );

    return chapterHTML + subChapterHTML;
}

export function chapterToPreviewHTML(text) {
    let { content, editorType } = parseText(text);
    let phtml = editorType === EDITOR_MARKDOWN 
            ? markdown2HTML(content) 
            : content;

    // let parser = new DOMParser();
    // let parsedHtml = parser.parseFromString(phtml, 'text/html');
    // let images = parsedHtml.getElementsByTagName('img');
    // _.forEach(images, img => {
    //   img.outerHTML = '<div class="msp-e-v-img-con">\n\t'
    //                 + img.outerHTML
    //                 + '\n\t<div tabindex="0" class="msp-e-v-img-wrapper">'
    //                 + 'Click to choose cover image</div>'
    //                 + '\n</div>';
    // });

    // console.log(parsedHtml.body.innerHTML)

    return {
        content,
        editorType,
        previewHTML: phtml //parsedHtml.body.innerHTML,
    };
}

// export function addEventsToPreviewHTML() {
//     let imgWrappers = document.getElementsByClassName('msp-e-v-img-wrapper');
//     _.forEach(imgWrappers, wrapper => {
//         wrapper.addEventListener('click', openCoverImagePicker)
//         console.log(wrapper)
//     })
// }