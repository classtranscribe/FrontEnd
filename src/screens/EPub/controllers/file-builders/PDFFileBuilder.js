/* eslint-disable no-unreachable */
/* eslint-disable no-console */
/* eslint-disable complexity */
import _, { random } from 'lodash';
import { html } from 'utils';
import { newPDF, STYLE_SHEET, placeholderImg, TextBox } from './file-templates/pdf';
import HTMLFileBuilder from './HTMLFileBuilder';


/**
 * File buffer builder for .epub
 */
class PDFFileBuilder {
  /**
   * Create an HTMLFileBuilder
   * @param {EPubData} ePubData
   * @param {Boolean} forPreview
   */

  constructor() {
    this.doc = newPDF();
    this.max_text_width = this.doc.getPageWidth() - (STYLE_SHEET.edgeMargin * 2)
    this.y_loc = STYLE_SHEET.vertEdgeMargin;
    this.max_height = this.doc.getPageHeight() - (STYLE_SHEET.vertEdgeMargin * 2);
    this.currentPageNumber = 1
  }

  async init(parsedData) {
    console.log("pdf builder data", parsedData);
    this.data = parsedData;
    this.glossaryData = parsedData.glossary;
  }

  /**
   * Convert an EPubData object to a downloadable html zipped combo buffer
   * @param {EPubData} ePubData
   * @returns {Buffer} html zipped combo buffer
   */
  static async toBuffer(ePubData) {
    // eslint-disable-next-line no-console
    const builder = new PDFFileBuilder(ePubData);
    await builder.init(ePubData, true);
    const buffer = await builder.getPDFBuffer();
    return buffer;
  }

  nextPage() {
    console.log("new page", this.currentPageNumber);
    this.currentPageNumber += 1;
    this.doc.addPage("a4, p");
    this.y_loc = STYLE_SHEET.vertEdgeMargin;
  }

  getYLoc(expected_size) {
    if (!expected_size) {
      return this.y_loc;
    }
    if (expected_size > this.max_height) {
      // should split lines in calling function
      // console.log("getyloc new page");
      this.nextPage();
    } else if (this.y_loc + expected_size > this.doc.getPageHeight() - STYLE_SHEET.vertEdgeMargin) {
      // console.log("getyloc new page other");
      this.nextPage();
    }
    return this.y_loc;
  }

  incrementYLoc(diff, allow_new_page = true) {
    if (allow_new_page && this.y_loc + diff > this.doc.getPageHeight() - STYLE_SHEET.vertEdgeMargin) {
      console.log("inc y loc newpage", diff, allow_new_page);
      this.nextPage();
    } else {
      this.y_loc += diff;
    }
  }

  writeTextToPDF(text, { size = STYLE_SHEET.font.body.size, align = "left", color = 0 }) {
    this.doc.setFontSize(size);
    this.doc.setTextColor(color);
    if ((typeof text === 'string') && text.trim() !== "") {
      const new_text = this.doc.splitTextToSize(text, this.max_text_width)
      const text_height = this.doc.getTextDimensions(new_text).h
      const curr_y_loc = this.getYLoc(text_height);
      if (curr_y_loc === null) {
        const slice_idx = Math.floor(new_text.length / 2);
        this.writeTextToPDF(new_text.slice(0, slice_idx).join(" "), { size, align, color });
        this.writeTextToPDF(new_text.slice(slice_idx, new_text.length).join(" "), { size, align, color });
        return;
      }
      this.doc.text(new_text, align === "left" ? STYLE_SHEET.edgeMargin : this.doc.getPageWidth() / 2, curr_y_loc, { align });
      this.incrementYLoc(text_height);
      return true;
    }
    return false;
  }

  convertText(text, latex = [], default_options = STYLE_SHEET.font.body) {
    console.log("pdf builder latex", latex);
    TextBox.write(this, text, latex, default_options);
  }

  convertImage({ src, descriptions, alt, height = 100, width = 100 }) {
    // console.log("pdf image data:", src, descriptions, alt, height, width)
    const scale = this.max_text_width / width;
    const curr_y_loc = this.getYLoc(height);
    this.doc.addImage(src === "" ? placeholderImg : src, STYLE_SHEET.edgeMargin, curr_y_loc, width * scale, height * scale);
    this.incrementYLoc(height * scale + STYLE_SHEET.image.imageAltGap);

    if (this.writeTextToPDF(alt, STYLE_SHEET.font.altText)) {
      this.incrementYLoc(STYLE_SHEET.image.AltDescGap);
    }
    _.forEach(descriptions, (desc) => {
      // console.log("convert img desc start");
      this.convertText(desc, STYLE_SHEET.font.imgDescription);
      // console.log("convert img desc end");
      // this.incrementYLoc(STYLE_SHEET.image.DescDescGap)
    })

    this.incrementYLoc(STYLE_SHEET.spacing);
  }

  convertContent(content) {
    console.log("convertContent", content);
    if (typeof content === 'string') {
      this.convertText(content);
    } else if ("latex" in content) {
      console.log("pdf latexing");
      this.convertText(content.text, content.latex);
    } else {
      this.convertImage(content);
    }
  }

  convertChapter({ contents, title }) {
    this.writeTextToPDF(title, STYLE_SHEET.font.chapterTitle);
    this.doc.outline.add(null, title, { pageNumber: this.currentPageNumber });
    this.incrementYLoc(STYLE_SHEET.spacing);
    // eslint-disable-next-line guard-for-in
    for (const contentIdx in contents) {
      this.convertContent(contents[contentIdx]);
    }
    this.nextPage();
  }

  convertChapters() {
    // eslint-disable-next-line guard-for-in
    for (const chapterIdx in this.data.chapters) {
      this.convertChapter(this.data.chapters[chapterIdx]);
    }
  }
  writeGlossaryEntry(key, value) {
    this.writeTextToPDF(`${key}: ${value.description}`, STYLE_SHEET.font.glossary);
  }
  convertGlossary(glossary) {
    this.doc.outline.add(null, "Glossary", { pageNumber: this.currentPageNumber })
    this.writeTextToPDF("Glossary", STYLE_SHEET.font.title);
    for (const [key, value] of Object.entries(glossary)) {
      this.writeGlossaryEntry(key, value);
    }
  }


  createPDF() {
    this.convertImage(this.data.cover);
    this.writeTextToPDF(this.data.title, STYLE_SHEET.font.title);
    this.incrementYLoc(STYLE_SHEET.spacing);
    this.writeTextToPDF(this.data.author, STYLE_SHEET.font.body);


    this.nextPage();
    this.convertChapters();

    this.convertGlossary(this.glossaryData);
    // // TODO: add glossary, add table of contents
  }

  async getPDFBuffer() {
    this.createPDF();
    return this.doc.output("blob");
  }

  static getOptions(options) {
    options.replaceImageSrc = true;
    options.replaceLatex = true;
    return options;
  }
}

export default PDFFileBuilder;
