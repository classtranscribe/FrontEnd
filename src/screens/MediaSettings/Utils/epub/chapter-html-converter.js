import _ from 'lodash';
import { EDITOR_TYPE_SPLITTER, EDITOR_MARKDOWN } from './constants';
import { html } from 'utils';
import { getImageUrl } from './util'

export function parseText(text) {
    let splittedTexts = _.split(text, EDITOR_TYPE_SPLITTER);
    let content = splittedTexts[0];
    let editorType = splittedTexts[1];

    return { content, editorType };
}

export function markdown2HTML(text) {
    return html.markdown(text);
}

export function chapterItemsToMarkdown(items) {
    let subTitle = items.length > 0 
                 ? '\n#### Transcript\n'
                 : '';

    return  subTitle
            + _.map(items, item => _.trim(item.text)).join('\n\n')
            + '\n\n'
            + EDITOR_TYPE_SPLITTER 
            + EDITOR_MARKDOWN;
}

export function chapterToHTML({ items, content, subChapters, image, title }) {
    if (!content) content = chapterItemsToMarkdown(items);
    content = parseText(content).content;

    let chapterHTML = '\n\n<!-- Please do not delete the title of the chapter -->\n'
                    + `## ${title}\n\n`
                    + (image ? `![Screenshot](${getImageUrl(image)})\n\n` : '')
                    + parseText(content).content;

    let subChapterHTML = _.reduce(
        subChapters,
        (subHtml, subChapter, index) => subHtml 
            + `\n\n<!-- Sub-chapter ${index + 1} -->\n`
            + `### ${subChapter.title}\n\n`
            + `![Screenshot](${getImageUrl(subChapter.image)})\n`
            // + '#### Transcript\n'
            + parseText(subChapter.text).content + '\n'
        ,
        '\n'
    );

    return chapterHTML 
         + subChapterHTML 
         + '\n\n'
         + EDITOR_TYPE_SPLITTER 
         + EDITOR_MARKDOWN;
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