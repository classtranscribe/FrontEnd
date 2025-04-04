import _ from 'lodash';
import AdmZip from 'adm-zip';
import { _buildID, html } from 'utils';
import { KATEX_MIN_CSS, PRISM_CSS } from './file-templates/styles';
import {
  glossaryToHTMLString,
} from './GlossaryCreator';
import { INDEX_HTML_LOCAL, STYLE_CSS/* , PRISM_JS */ } from './file-templates/html';
import { epubIsText } from './utils';

class HTMLFileBuilder {
  /**
   * Create an HTMLFileBuilder
   * @param {EPubData} ePubData
   * @param {Boolean} forPreview
   */
  constructor() {
    this.zip = new AdmZip();
  }

  init(parsedData, createLinks = true) {
    this.createLinks = createLinks;
    this.data = parsedData;
    this.glossary = parsedData.glossary
    this.videoLinks = parsedData.videoLinks;
  }

  /**
   * Convert an EPubData object to a downloadable html zipped combo buffer
   * @param {EPubData} ePubData
   * @returns {Buffer} html zipped combo buffer
   */
  static async toBuffer(parsedData) {
    const builder = new HTMLFileBuilder();
    builder.init(parsedData);
    const buffer = await builder.getHTMLBuffer();
    return buffer;
  }

  static toHTMLString(parsedData) {
    const builder = new HTMLFileBuilder();
    builder.init(parsedData, false);
    const html_buffer = builder.getIndexHTML()
    return html_buffer;
  }

  static convertText(content, includeRawLatex) {
    if (includeRawLatex) {
      content = content.replace(/\$\$(.*?)\$\$/g, `$$$$$1$$$$ \`($1)\``);
    }
    let text = [
      '<p>',
      html.markdown(content),
      '</p>'
    ].join("")
    return text
  };
  static convertImage(content, videoLinks) {
    let despId = _buildID();
    return [
      '<div class="img-block">',
      videoLinks && content.link && content.link !== "" ? `<a href="${content.link}">` : "",
      `\t<img src="${content.src}" alt="${content.alt}" aria-describedby="${despId}" />`,
      videoLinks && content.link && content.link !== "" ? `</a>` : "",
      content.descriptions.length !== 0 ? `\t<div id="${despId}">${html.markdown(content.descriptions.join("\n"))}</div>` : "",
      '</div>'
    ].join('\n');
  }

  static convertContent(content, includeRawLatex, videoLinks) {
    if (epubIsText(content)) {
      return HTMLFileBuilder.convertText(content, includeRawLatex);
    }
    return HTMLFileBuilder.convertImage(content, videoLinks);
  }

  static convertChapter(idx, chapter, chapterGlossary, includeRawLatex = false, videoLinks = false) {
    let glossaryText = chapterGlossary ? glossaryToHTMLString(chapterGlossary) : "";
    chapter.id = _buildID();
    return [
      // the first chapter has idx 0, but is chapter 1. Thus, we use idx+1
      `<!-- Chapter -->\n<h2 data-ch id="${chapter.id}">${idx + 1}: ${chapter.title}</h2>`,
      `<div class="wrap-text">`,
      _.map(chapter.contents, (c) => HTMLFileBuilder.convertContent(c, includeRawLatex, videoLinks)).join("\n"),
      `</div>`,
      glossaryText
    ].join("\n\n");
  }

  convertChapters() {
    const chapters = this.data.chapters
    return [
      '<div class="ee-preview-text-con">',
      _.map(chapters, (ch, idx) => HTMLFileBuilder.convertChapter(idx, ch, this.data.chapterGlossary ? this.data.chapterGlossary[idx] : false, this.data.includeRawLatex, this.videoLinks)).join("\n"),
      '</div>',
    ].join("\n");
  }
  convertVisualTOC() {
    return _.map(this.data.visualTOC, (ch, chIdx) => {
      let link_target = this.data.chapters[chIdx].id;
      return _.map(ch, (img) => {
        const caption_id = _buildID();
        return [
          '<div class="img-block">',
          `<a href=#${link_target}>`,
          `\t<img src="${img.src}" alt="${img.alt}" aria-describedby="${caption_id}"/>`,
          `\t<p class="wrap-text" id="${caption_id}">${img.alt}</p>`,
          `</a>`,
          '</div>'
        ].join("\n");
      }).join("\n");
    }).join("\n");
  }
  convertTOC() {
    const chapters = this.data.chapters;
    const createLinks = this.createLinks;
    return _.map(
      chapters,
      (ch, chIndex) => `
          <h3><a ${createLinks ? `href="#${ch.id}"` : ""}>${chIndex + 1} - ${ch.title}</a></h3>
          <ol>
              ${_.map(
        ch.subChapters,
        (subch, subIndex) => `
            <li>
              <a ${createLinks ? `href="#${subch.id}"` : ""} >${chIndex + 1}.${subIndex + 1} - ${subch.title}</a>
            </li>`,
      ).join('\n')}
          </ol>
      `,
    ).join('\n');
  }

  static convertGlossary(glossary) {
    return `<html><body><div>${glossaryToHTMLString(glossary)}</html></body></div>`;
  }

  getIndexHTML() {
    const conversion = this.convertChapters();
    let toc = "";
    if (this.data.visualTOC) {
      toc = this.convertVisualTOC();
    } else {
      toc = this.convertTOC();
    }
    return INDEX_HTML_LOCAL({
      title: this.data.title,
      navContents: toc,
      content: conversion,
      author: this.data.author,
      cover: this.data.cover,
      createLinks: this.createLinks,
      visualTOC: this.data.visualTOC
    }) + (this.data.chapterGlossary ? "" : HTMLFileBuilder.convertGlossary(this.data.glossary));
  }

  async getHTMLBuffer() {
    const zip = this.zip;

    // styles
    // styles/style.css
    zip.addFile('styles/style.css', Buffer.from(STYLE_CSS));
    // styles/katex.min.css
    zip.addFile('styles/katex.min.css', Buffer.from(KATEX_MIN_CSS));
    // styles/prism.css
    zip.addFile('styles/prism.css', Buffer.from(PRISM_CSS));

    const indexHTML = this.getIndexHTML();
    zip.addFile('index.html', Buffer.from(indexHTML));

    return zip.toBuffer();
  }

  static getOptions(options) {
    options.replaceImageSrc = true;
    options.replaceLatex = false;
    return options;
  }
}

export default HTMLFileBuilder;
