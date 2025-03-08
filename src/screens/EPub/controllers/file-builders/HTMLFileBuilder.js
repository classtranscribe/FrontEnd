import _ from 'lodash';
import AdmZip from 'adm-zip';
import { _buildID, html } from 'utils';
import { KATEX_MIN_CSS, PRISM_CSS } from './file-templates/styles';
import {
  glossaryToHTMLString,
} from './GlossaryCreator';
import { INDEX_HTML_LOCAL, STYLE_CSS/* , PRISM_JS */ } from './file-templates/html';

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

  static convertText(content) {
    return [
      '<p>',
      html.markdown(content),
      '</p>'
    ].join("")
  };
  static convertImage(content) {
    if (content.descriptions.length !== 0) {
      let despId = _buildID();
      return [
        '<div class="img-block">',
        `\t<img src="${content.src}" alt="${content.alt}" aria-describedby="${despId}" />`,
        `\t<div id="${despId}">${html.markdown(content.descriptions.join("\n"))}</div>`,
        '</div>'
      ].join('\n');
    }
    return [
      '<div class="img-block">',
      `\t<img src="${content.src}" alt="${content.alt}" />`,
      '</div>'
    ].join('\n');
  }

  static convertContent(content) {
    if (typeof content === 'string') {
      return HTMLFileBuilder.convertText(content)
    }
    return HTMLFileBuilder.convertImage(content)
  }

  static convertChapter(chapter) {
    chapter.id = _buildID();
    return [
      `<!-- Chapter -->\n<h2 data-ch id="${chapter.id}">${chapter.title}</h2>`,
      _.map(chapter.contents, (c) => HTMLFileBuilder.convertContent(c)).join("\n"),
    ].join("\n\n");
  }

  convertChapters() {
    const chapters = this.data.chapters
    return [
      '<div class="ee-preview-text-con">',
      _.map(chapters, (ch) => HTMLFileBuilder.convertChapter(ch)).join("\n"),
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
          `\t<p id="${caption_id}">${img.alt}</p>`,
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

  convertGlossary() {
    return glossaryToHTMLString(this.glossary);
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
      title: this.title,
      navContents: toc,
      content: conversion,
      author: this.data.author,
      cover: this.data.cover,
      createLinks: this.createLinks,
      visualTOC: this.data.visualTOC
    })
      + this.convertGlossary();
    // TODO: test glossary, add table of contents
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
