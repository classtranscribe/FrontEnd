import _ from 'lodash';
import { newPDF, STYLE_SHEET, placeholderImg, TextBox } from './file-templates/pdf';


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
    this.pageOffset = 0;
    this.chapter_page_indexes = []
  }

  async init(parsedData) {
    this.data = parsedData;
    this.glossary = parsedData.glossary;
    this.includeRawLatex = parsedData.includeRawLatex;
    this.videoLinks = parsedData.videoLinks;
  }

  /**
   * Convert an EPubData object to a downloadable html zipped combo buffer
   * @param {EPubData} ePubData
   * @returns {Buffer} html zipped combo buffer
   */
  static async toBuffer(ePubData) {
    const builder = new PDFFileBuilder(ePubData);
    await builder.init(ePubData, true);
    const buffer = await builder.getPDFBuffer();
    return buffer;
  }

  nextPage() {
    this.currentPageNumber += 1;
    this.doc.addPage("a4, p");
    this.y_loc = STYLE_SHEET.vertEdgeMargin;
  }

  getYLoc(expected_size) {
    if (!expected_size) {
      return this.y_loc;
    }
    if (expected_size > this.max_height) {
      // should split pages in calling function. this is a fallback in case that doesn't happen
      this.nextPage();
    } else if (this.y_loc + expected_size > this.doc.getPageHeight() - STYLE_SHEET.vertEdgeMargin) {
      this.nextPage();
    }
    return this.y_loc;
  }

  incrementYLoc(diff, allow_new_page = true) {
    if (allow_new_page && this.y_loc + diff > this.doc.getPageHeight() - STYLE_SHEET.vertEdgeMargin) {
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

  convertText(content, default_options = STYLE_SHEET.font.body) {
    if (typeof content === "string") {
      TextBox.write(this, content, [], default_options)
    } else {
      TextBox.write(this, content.text, content.latex, default_options);
    }
  }

  convertImage({ src, descriptions, alt, height = 100, width = 100, link }) {
    const scale = this.max_text_width / width;
    const curr_y_loc = this.getYLoc(height * scale);
    this.doc.addImage(src === "" ? placeholderImg : src, STYLE_SHEET.edgeMargin, curr_y_loc, width * scale, height * scale);
    if (this.videoLinks && link && link !== "") {
      this.doc.link(STYLE_SHEET.edgeMargin, curr_y_loc, width * scale, height * scale, { url: link });
    }
    this.incrementYLoc(height * scale + STYLE_SHEET.font.altText.size);

    if (this.writeTextToPDF(alt, STYLE_SHEET.font.altText)) {
      this.incrementYLoc(STYLE_SHEET.image.AltDescGap);
    }
    _.forEach(descriptions, (desc) => {
      this.convertText(desc, STYLE_SHEET.font.imgDescription);
    })

    this.incrementYLoc(STYLE_SHEET.spacing);
  }

  convertContent(content) {
    if (typeof content === 'string' || "latex" in content) {
      this.convertText(content);
    } else {
      this.convertImage(content);
    }
  }

  convertChapter(idx, { contents, title }) {
    this.incrementYLoc(STYLE_SHEET.spacing);
    this.writeTextToPDF(`${idx + 1}: ${title}`, STYLE_SHEET.font.chapterTitle);
    this.chapter_page_indexes.push(this.currentPageNumber);
    this.incrementYLoc(STYLE_SHEET.spacing);
    _.forEach(contents, (content) => { this.convertContent(content) });
    if (this.data.chapterGlossary) {
      this.incrementYLoc(20);
      this.convertGlossary(this.data.chapterGlossary[idx], false);
    }
    this.nextPage();
  }

  convertChapters() {
    _.forEach(this.data.chapters, (chapter, idx) => this.convertChapter(idx, chapter))
  }
  writeGlossaryEntry(key, value) {
    this.writeTextToPDF(`${key}: ${value.description}`, STYLE_SHEET.font.glossary);
  }
  convertGlossary(glossary, add_outline = true) {
    this.incrementYLoc(STYLE_SHEET.spacing);
    if (add_outline) {
      this.glossary_page = this.currentPageNumber;
    }
    this.writeTextToPDF("Glossary", add_outline ? STYLE_SHEET.font.title : STYLE_SHEET.font.chapterTitle);
    for (const [key, value] of Object.entries(glossary)) {
      this.writeGlossaryEntry(key, value);
      this.incrementYLoc(5);
    }
  }
  nextPageTOC(offset = 0) {
    this.y_loc = offset + STYLE_SHEET.vertEdgeMargin;
    this.doc.insertPage(this.currentPageNumber);
    this.currentPageNumber += 1;
  }

  convertVisualTOC(visualTOC) {
    if (_.isEmpty(this.data.visualTOC.flat())) {
      return;
    }
    const style = STYLE_SHEET.visualTOC;
    const all_imgs = visualTOC.flat()

    const col_width = (this.max_text_width / style.imagesPerRow);
    const img_width = (col_width - 2 * style.hMargin);
    const tallest_img = _.maxBy(all_imgs, img => img.height / img.width);
    const tallest_aspect_ratio = tallest_img.height / tallest_img.width
    const rowsPerPage = Math.floor((this.max_height - STYLE_SHEET.visualTOC.topMargin) / (tallest_aspect_ratio * img_width + style.vSpacing));

    this.pageOffset = Math.ceil(all_imgs.length / (style.imagesPerRow * rowsPerPage));
    this.currentPageNumber = 2;
    this.nextPageTOC();

    this.doc.setFontSize(STYLE_SHEET.font.title.size);
    this.doc.setTextColor(STYLE_SHEET.font.title.color);
    this.doc.text("Table of Contents", this.doc.getPageWidth() / 2, STYLE_SHEET.font.title.size + this.y_loc, { align: "center" })
    this.y_loc += style.topMargin

    this.doc.setFontSize(style.font.size);
    this.doc.setTextColor(style.font.color);
    let entry_idx = 0;

    for (let chapter = 0; chapter < visualTOC.length; chapter += 1) {
      for (let img_idx = 0; img_idx < visualTOC[chapter].length; img_idx += 1) {
        const img = visualTOC[chapter][img_idx];
        const x_loc = STYLE_SHEET.edgeMargin + (entry_idx % style.imagesPerRow) * col_width;

        const scale = img_width / img.width;
        this.doc.addImage(img.src, 'jpeg', x_loc + style.hMargin, this.y_loc, scale * img.width, scale * img.height);
        const split_text = this.doc.splitTextToSize(`${chapter + 1}. ${img.alt}`, scale * img.width);
        _.forEach(split_text, (val, idx) => {
          if (idx === style.maxLines - 1 && style.maxLines < split_text.length) {
            val = `${val.slice(0, -4)}...`
          } else if (idx >= style.maxLines) {
            return;
          }
          const new_y_loc = this.y_loc + scale * img.height + (style.font.size * (idx + 1))
          this.doc.textWithLink(val, x_loc + style.hMargin, new_y_loc, { pageNumber: this.pageOffset + this.chapter_page_indexes[chapter] });
        })

        entry_idx += 1;
        if (entry_idx % style.imagesPerRow === 0) {
          this.y_loc += tallest_aspect_ratio * img_width + style.vSpacing;
        }
        if (entry_idx % (style.imagesPerRow * rowsPerPage) === 0 && entry_idx < all_imgs.length - 1) {
          this.nextPageTOC(style.topMargin);
        }
      }
    }
  }
  convertTOC(chapters) {
    const TOC_width = this.max_text_width - 2 * STYLE_SHEET.TOC.hMargin;
    let split_titles = _.map(chapters, (chapter) => { return this.doc.splitTextToSize(chapter.title, TOC_width) });
    let num_lines = split_titles.flat().length;
    let lines_per_page = Math.floor((this.max_height - STYLE_SHEET.TOC.topMargin) / (STYLE_SHEET.TOC.font.size + STYLE_SHEET.TOC.vSpacing));
    this.pageOffset = Math.ceil(num_lines / lines_per_page);

    this.currentPageNumber = 2;
    this.nextPageTOC();

    this.doc.setFontSize(STYLE_SHEET.font.title.size);
    this.doc.setTextColor(STYLE_SHEET.font.title.color);
    this.doc.text("Table of Contents", this.doc.getPageWidth() / 2, STYLE_SHEET.font.title.size + this.y_loc, { align: "center" })
    this.y_loc += STYLE_SHEET.TOC.topMargin

    this.doc.setFontSize(STYLE_SHEET.TOC.font.size);
    this.doc.setTextColor(STYLE_SHEET.font.link.color);

    let line_num = 0;
    for (let chapterIdx = 0; chapterIdx < this.data.chapters.length; chapterIdx += 1) {
      for (let idx = 0; idx < split_titles[chapterIdx].length; idx += 1) {
        // puts `chIdx. ` in front if first line 
        const line = `${idx === 0 ? `${chapterIdx + 1}. ` : ""}${split_titles[chapterIdx][idx]}`;
        this.y_loc += (STYLE_SHEET.TOC.font.size + STYLE_SHEET.TOC.vSpacing);
        this.doc.textWithLink(line, STYLE_SHEET.edgeMargin + STYLE_SHEET.TOC.hMargin, this.y_loc, { pageNumber: this.chapter_page_indexes[chapterIdx] + this.pageOffset });
        line_num += 1;
        if (line_num >= lines_per_page && line_num < num_lines) {
          this.nextPageTOC(STYLE_SHEET.TOC.topMargin);
        }
      }
    }
  }

  convertOutline() {
    for (let i = 0; i < this.chapter_page_indexes.length; i += 1) {
      this.doc.outline.add(null, this.data.chapters[i].title, { pageNumber: this.chapter_page_indexes[i] + this.pageOffset });
    }
    if (this.glossary_page) {
      this.doc.outline.add(null, "Glossary", { pageNumber: this.glossary_page + this.pageOffset });
    }
  }

  createPDF() {
    this.convertImage(this.data.cover);
    this.writeTextToPDF(this.data.title, STYLE_SHEET.font.title);
    this.incrementYLoc(STYLE_SHEET.spacing);
    this.writeTextToPDF(this.data.author, STYLE_SHEET.font.body);


    this.nextPage();
    this.convertChapters();

    if (this.glossary && !_.isEmpty(this.glossary) && !this.data.chapterGlossary) {
      this.convertGlossary(this.glossary);
    }

    if (this.data.visualTOC) {
      this.convertVisualTOC(this.data.visualTOC);
    } else {
      this.convertTOC(this.data.chapters);
    }

    this.convertOutline();
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
