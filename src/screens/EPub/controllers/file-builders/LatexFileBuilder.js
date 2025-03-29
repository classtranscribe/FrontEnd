import _ from 'lodash';
import AdmZip from 'adm-zip';

import { html } from 'utils';
import { epubIsText } from './utils';

class LatexFileBuilder {
  /**
   * Create an HTMLFileBuilder
   * @param {EPubData} ePubData
   * @param {Boolean} forPreview
   */
  constructor() {
    this.zip = new AdmZip();
    this.ch_id = 0;
  }

  async init(parsedData) {
    this.data = parsedData;
    this.glossary = parsedData.glossary;
  }

  /**
   * Convert an EPubData object to a downloadable html zipped combo buffer
   * @param {EPubData} ePubData
   * @returns {Buffer} html zipped combo buffer
   */
  static async toBuffer(parsedData) {
    const builder = new LatexFileBuilder();
    await builder.init(parsedData);
    const buffer = await builder.getLatexBuffer();
    return buffer;
  }

  convertGlossary(glossary, is_section = true) {
    if (_.isEmpty(glossary)) {
      return ""
    }
    let text = is_section ? `\\section{Glossary}\n` : `\\subsection{Glossary}\n`;
    return text + _.map(glossary, (value, key) => {
      const new_key = LatexFileBuilder.escapeSpecialChars(key);
      const new_desc = LatexFileBuilder.escapeSpecialChars(value.description);
      return `\\textbf{${new_key}}: ${new_desc}`;
    }).join("\n\n");
  }

  getTitlePage(title, author, cover) {
    title = LatexFileBuilder.escapeSpecialChars(title);
    author = LatexFileBuilder.escapeSpecialChars(author);
    return `
    \\begin{titlepage}
      \\centering
      \\vfill
      {\\bfseries\\Large
        ${title}
        \\vskip2cm
        ${author}
      }    
      \\vfill
      \\includegraphics[width=8cm]
      {${this.saveImage(cover)}}
      \\vfill
      \\vfill
  \\end{titlepage}
  `
  }

  saveImage(content) {
    const img_path = `images/${content.id}.jpeg`
    this.zip.addFile(img_path, content.buffer);
    return img_path
  }
  convertContent(content) {
    if (epubIsText(content)) {
      return LatexFileBuilder.markdownToLatex(content);
    }
    const img_path = this.saveImage(content);
    const captions = _.map(content.descriptions, (d) => {
      const new_desc = LatexFileBuilder.markdownToLatex(d);
      return `\\caption*{${new_desc}}`
    }).join("\n");

    const new_alt = LatexFileBuilder.escapeSpecialChars(content.alt);
    return [
      `\\begin{figure}`,
      `\\centering`,
      `\\includegraphics[alt={${new_alt}}, width=.8\\textwidth]{${img_path}}`,
      captions,
      `\\end{figure}`
    ].join("\n")
  }

  convertChapter(idx, chapter) {
    chapter.title = LatexFileBuilder.escapeSpecialChars(chapter.title)
    return [
      `\\section{${chapter.title}}`,
      `\\label{sec:${idx}}`,
      _.map(chapter.contents, (c) => this.convertContent(c)).join("\n"),
      this.data.chapterGlossary ? this.convertGlossary(this.data.chapterGlossary[idx], false) : ""
    ].join("\n");
  }

  convertVisualTOC(visualTOC) {
    let all_imgs = _.flatMap(visualTOC, (imgs, chapter) => imgs.map(img => ({ ...img, chapter })))
    return `
      \\section{Contents}
      \\begin{center}
        ${_.chunk(all_imgs, 2).map((pair) => {
      return _.map(pair, (img) => {
        // evil hack to allow latex to split a long word.
        const split_alt = img.alt.replace(/(.{10})/g, `$1\\hspace{0pt}`);

        return `
        \\begin{minipage}{0.45\\textwidth}
        \\centering
        \\includegraphics[width =\\linewidth]{images/${img.id}.jpeg}
        \\hyperref[sec:${img.chapter}]{${split_alt}}
        \\end{minipage}
        `}).join("\\hfill");
    }).join("\\vspace{1em}")}
    \\end{center}
    `;
  }
  getMainText() {
    const chapters = _.map(this.data.chapters, (ch, idx) => this.convertChapter(idx, ch)).join("\n");

    const TOC = this.data.visualTOC ? this.convertVisualTOC(this.data.visualTOC) : `\\tableofcontents`;
    const titlepage = this.getTitlePage(this.data.title, this.data.author, this.data.cover);
    const glossary = this.data.chapterGlossary ? "" : this.convertGlossary(this.glossary)
    return [
      "\\documentclass{article}",
      "\\usepackage{caption}",
      "\\usepackage{graphicx}",
      "\\usepackage{hyperref}",
      "\\usepackage[T1]{fontenc}",
      "\\begin{document}",
      titlepage,
      TOC,
      chapters,
      glossary,
      "\\end{document}"
    ].join("\n");
  }

  async getLatexBuffer() {
    const zip = this.zip;

    const indexHTML = this.getMainText();
    zip.addFile('main.tex', Buffer.from(indexHTML));

    return zip.toBuffer();
  }


  static markdownToLatex(markdown) {
    const markdown_stripped = markdown.replace(/\$\$(.*?)\$\$/g, '<latex>$1</latex>');

    const html_text = html.markdown(markdown_stripped);
    return LatexFileBuilder.htmlToLatex(html_text)
  }

  static htmlToLatex(html_text) {
    let latex = html_text;

    // Replace special characters without affecting code blocks or latex sections
    latex = LatexFileBuilder.substituteSpecialChars(latex);

    // Convert tables
    latex = latex.replace(/<table>(.*?)<\/table>/gs, (match) => {
      return LatexFileBuilder.htmlTableToLatex(match);
    })

    // Convert bold and strong text
    latex = latex.replace(/<(b|strong)>(.*?)<\/\1>/gs, '\\textbf{$2}');

    // Convert italic and em text
    latex = latex.replace(/<(i|em)>(.*?)<\/\1>/gs, '\\textit{$2}');

    // Convert underline text
    latex = latex.replace(/<u>(.*?)<\/u>/gs, '\\underline{$1}');

    // Convert block quote
    latex = latex.replace(/<blockquote>(.*?)<\/blockquote>/gs, '\\begin{quote}$1\\end{quote}');

    // Convert code block
    latex = latex.replace(/<code>(.*?)<\/code>/gs, '\\begin{verbatim}$1\\end{verbatim}');

    // Convert paragraphs
    latex = latex.replace(/<p>(.*?)<\/p>/gs, '\n$1\n');

    // Convert headings (h1, h2, h3...)
    const level_maps = {
      1: `section`,
      2: `subsection`,
      3: `subsubsection`,
      4: `paragraph`,
      5: `subparagraph`,
      6: `subparagraph`
    }
    latex = latex.replace(/<h([1-6]) id=".*?">(.*?)<\/h\1>/gs, (match, level, content) => {
      return `\\${level_maps[level]}{${content}}`;
    });

    // Convert links
    latex = latex.replace(/<a href="(.*?)">(.*?)<\/a>/gs, '\\href{$1}{$2}');

    // Convert ordered lists
    latex = latex.replace(/<ol>(.*?)<\/ol>/gs, (match, content) => {
      return `\\begin{enumerate} \n${content.replace(/<li>(.*?)<\/li>/gs, '\\item $1')} \n\\end{enumerate} `;
    });

    // Convert unordered lists
    latex = latex.replace(/<ul>(.*?)<\/ul>/gs, (match, content) => {
      return `\\begin{itemize} \n${content.replace(/<li>(.*?)<\/li>/gs, '\\item $1')} \n\\end{itemize} `;
    });

    // Convert custom math tag
    latex = latex.replace(/<latex>(.*?)?<\/latex>/gs, '$$$1$$')

    // Convert newline
    latex = latex.replace(/<br>/gs, "\\newline")

    return latex;
  }

  static escapeSpecialChars(str) {
    str = str.replace(/\\/g, '\\textbackslash ');
    str = str.replace(/\$/g, '\\$');
    str = str.replace(/\{/g, '\\{');
    str = str.replace(/\}/g, '\\}');
    str = str.replace(/&/g, '\\&');
    str = str.replace(/#/g, '\\#');
    str = str.replace(/\^/g, '\\^');
    str = str.replace(/_/g, '\\_');
    str = str.replace(/%/g, '\\%');
    str = str.replace(/~/g, '\\~');
    return str
  }
  static removeVerbatimEscape(str) {
    const regex = /\\end\{verbatim\}/g
    while (regex.test(str)) {
      str = str.replace(regex, '');
    }
    return str;
  }
  static removeUnescapedDollar(str) {
    // catches all $ with an odd number of slashes in front
    const regex = /((?<!\\)(?:\\\\)*)\$/g
    return str.replace(regex, '$1');
  }
  static substituteSpecialChars(htmlString) {
    // Parse the HTML string into a DOM structure
    const excludeTags = ['code', 'latex']
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Recursive function to traverse and apply text substitution to text nodes
    function traverseAndReplace(node, state = "") {
      // If the node is a text node, apply the substitution
      if (node.nodeType === Node.TEXT_NODE) {
        if (state === "") {
          node.textContent = LatexFileBuilder.escapeSpecialChars(node.textContent);
        } else if (state === 'code') {
          node.textContent = LatexFileBuilder.removeVerbatimEscape(node.textContent);
        } else if (state === 'latex') {
          node.textContent = LatexFileBuilder.removeUnescapedDollar(node.textContent);
        }
      }

      // If the node is an element, traverse its children while tracking if we are inside specific blocks
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (excludeTags.includes(node.tagName.toLowerCase()) && state === "") {
          for (let child of node.childNodes) {
            traverseAndReplace(child, node.tagName.toLowerCase());
          }
        } else {
          for (let child of node.childNodes) {
            traverseAndReplace(child, state);
          }
        }
      }
    }

    // Start the traversal from the root of the document (body)
    traverseAndReplace(doc.body);

    // Serialize the DOM back to an HTML string and return it
    return doc.body.innerHTML;
  }

  static parseTableHTML(table_string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(table_string, "text/html");
    const table = doc.body.firstElementChild;

    if (!table) return [];

    return Array.from(table.rows).map(row =>
      Array.from(row.cells).map(cell => cell.textContent.trim())
    );
  }

  static htmlTableToLatex(htmlString) {
    // Parse the HTML string into a DOM structure
    const data = LatexFileBuilder.parseTableHTML(htmlString)
    let latex = '\\begin{tabular}{';

    const num_rows = data.length;
    const num_cols = data[0].length;
    for (let i = 0; i < num_cols; i += 1) {
      latex += 'l';
    }
    latex += '}\n';

    // Add the table headers
    for (let col = 0; col < num_cols; col += 1) {
      latex += data[0][col];
      if (col < num_cols - 1) {
        latex += ' & ';
      }
    }
    latex += ' \\\\ \\hline\n';

    // Add the table rows
    for (let row = 1; row < num_rows; row += 1) {
      for (let col = 0; col < num_cols; col += 1) {
        latex += data[row][col];
        if (col < num_cols - 1) {
          latex += ' & ';
        }
      }
      latex += ' \\\\ \n';
    }

    latex += '\\end{tabular}';

    return latex;
  }

  static getOptions(options) {
    options.replaceImageSrc = false;
    options.replaceLatex = false;
    return options;
  }
}
export default LatexFileBuilder;
