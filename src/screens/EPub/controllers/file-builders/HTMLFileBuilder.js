/* eslint-disable no-console */
/* eslint-disable complexity */
import _ from 'lodash';
import AdmZip from 'adm-zip';
// import { EPubData } from 'entities/EPubs';
// import { doc } from 'prettier';
// import { jsPDF as JsPDF } from 'jspdf';

import { _buildID, html } from 'utils';
import { KATEX_MIN_CSS, PRISM_CSS } from './file-templates/styles';
import {
  glossaryToHTMLString,
} from './GlossaryCreator';

import { INDEX_HTML_LOCAL, STYLE_CSS/* , PRISM_JS */ } from './file-templates/html';
import EPubParser from './EPubParser';

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
    this.glossaryData = parsedData.glossary
  }

  /**
   * Convert an EPubData object to a downloadable html zipped combo buffer
   * @param {EPubData} ePubData
   * @returns {Buffer} html zipped combo buffer
   */
  static async toBuffer(parsedData) {
    // eslint-disable-next-line no-console
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

  static convertContent(content) {
    if (typeof content === 'string') {
      return [
        '<p>',
        html.markdown(content),
        '</p>'
      ].join("")
    };

    // unwrap __data__ for correct image loading in subchapters 
    if ("__data__" in content) {
      content = content.__data__
    }

    if (content.src === null) {
      content.src = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
      let despId = _buildID();
      return [
        '<div class="img-block">',
        `\t<img src="${content.src}" alt="${content.alt}" aria-describedby="${despId}" />`,
        `\t<div id="${despId}">${html.markdown(content.descriptions.join("\n"))}</div>`,
        '</div>'
      ].join('\n');
    }
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

  static convertChapter({ contents, id, title }) {
    return [
      `<!-- Chapter -->\n<h2 data-ch id="${id}">${title}</h2>`,
      _.map(contents, (c) => HTMLFileBuilder.convertContent(c)).join("\n"),
    ].join("\n\n");
  }

  convertChapters() {
    const chapters = this.data.chapters
    return [
      '<div id="epub_content">',
      '<div class="ee-preview-text-con">',
      _.map(chapters, (ch) => HTMLFileBuilder.convertChapter(ch)).join("\n"),
      '</div>',
      '</div>',
    ].join("\n");
  }

  convertTableOfContents() {
    const chapters = this.data.chapters
    const createLinks = this.createLinks
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
    return glossaryToHTMLString(this.glossaryData);
  }

  getIndexHTML() {
    const conversion = this.convertChapters();
    const toc = this.convertTableOfContents();
    console.log("HTMLFileBuilder, cover", this.data.cover);
    return INDEX_HTML_LOCAL({ title: this.title, navContents: toc, content: conversion, author: this.data.author, cover: this.data.cover, createLinks: this.createLinks })
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
