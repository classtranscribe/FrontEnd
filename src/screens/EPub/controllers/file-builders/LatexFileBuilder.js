/* eslint-disable no-console */
/* eslint-disable complexity */
import _ from 'lodash';
import AdmZip from 'adm-zip';

import { html } from 'utils';
import { KATEX_MIN_CSS, PRISM_CSS } from './file-templates/styles';
import {
  glossaryToHTMLString,
} from './GlossaryCreator';

import { INDEX_HTML_LOCAL, STYLE_CSS/* , PRISM_JS */ } from './file-templates/html';

class LatexFileBuilder {
  /**
   * Create an HTMLFileBuilder
   * @param {EPubData} ePubData
   * @param {Boolean} forPreview
   */
  constructor() {
    this.image_idx = 0
    this.zip = new AdmZip();
  }

  async init(parsedData) {
    this.data = parsedData;
    this.glossaryData = parsedData.glossary
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

  convertGlossary() {
    return ""
  }

  getTitlePage(title, author, cover_img) {
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
      \\includegraphics[width=4cm]{${cover_img}} % also works with logo.pdf
      \\vfill
      \\vfill
  \\end{titlepage}
  `
  }

  getImageId() {
    this.image_idx += 1
    return this.image_idx
  }

  convertContent(content) {
    if (typeof content === "string") {
      return LatexFileBuilder.markdownToLatex(content);
    }
    console.log("Latex file builder image", content, this.image_idx);
    const img_path = `images/${this.getImageId()}.jpeg`
    // console.log("latex image path", img_path);
    this.zip.addFile(img_path, content.buffer);
    const captions = _.map(content.descriptions, (d) => {
      const new_desc = LatexFileBuilder.markdownToLatex(d);
      return `\\caption*{${new_desc}}`
    }).join("\n");
    return [
      `\\begin{figure}`,
      `\\centering`,
      `\\includegraphics[alt={${content.alt}}]{${img_path}}`,
      captions,
      `\\end{figure}`
    ].join("\n")
  }

  convertChapter(chapter) {
    return [
      `\\section{${chapter.title}}`,
      _.map(chapter.contents, (c) => this.convertContent(c)).join("\n")
    ].join("\n");
  }
  getMainText() {
    return [
      "\\documentclass{book}",
      "\\usepackage{caption}",
      "\\usepackage{graphicx}",
      "\\usepackage{hyperref}",
      "\\usepackage[T1]{fontenc}",
      "\\begin{document}",
      this.getTitlePage(this.data.title, this.data.author, "placeholder"),
      _.map(this.data.chapters, (ch) => this.convertChapter(ch)).join("\n"),
      this.convertGlossary(),
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
    console.log("html_text preconversion", latex);


    // Replace special characters without affecting code blocks or latex sections
    latex = LatexFileBuilder.substituteSpecialChars(latex);

    // Convert tables
    latex = latex.replace(/<table>(.*?)<\/table>/gs, (match) => {
      console.log("replacing origin", match);
      return LatexFileBuilder.htmlTableToLatex(match);
    })

    // Convert bold and strong text
    latex = latex.replace(/<(b|strong)>(.*?)<\/\1>/gs, '\\textbf{$2}');

    // Convert italic and em text
    latex = latex.replace(/<(i|em)>(.*?)<\/\1>/gs, '\\textit{$2}');

    // Convert underline text
    latex = latex.replace(/<u>(.*?)<\/u>/gs, '\\underline{$1}');

    // Convert block quote
    latex = latex.replace(/<blockquote>(.*?)<\/blockquote>/gs, '\\\\$1\\\\');

    // Convert code block
    latex = latex.replace(/<code>(.*?)<\/code>/gs, '\\begin{verbatim}$1\\end{verbatim}');

    // Convert paragraphs
    latex = latex.replace(/<p>(.*?)<\/p>/gs, '\n$1\n');

    // Convert headings (h1, h2, h3...)
    latex = latex.replace(/<h([1-6])>(.*?)<\/h\1>/g, (match, level, content) => {
      return `\\${'section'.repeat(level)}{${content}}`;
    });

    // Convert links
    latex = latex.replace(/<a href="(.*?)">(.*?)<\/a>/gs, '\\href{$1}{$2}');

    // Convert ordered lists
    latex = latex.replace(/<ol>(.*?)<\/ol>/gs, (match, content) => {
      return `\\begin{enumerate}\n${content.replace(/<li>(.*?)<\/li>/gs, '\\item $1')}\n\\end{enumerate}`;
    });

    // Convert unordered lists
    latex = latex.replace(/<ul>(.*?)<\/ul>/gs, (match, content) => {
      return `\\begin{itemize}\n${content.replace(/<li>(.*?)<\/li>/gs, '\\item $1')}\n\\end{itemize}`;
    });

    // Convert custom math tag
    latex = latex.replace(/<latex>(.*?)?<\/latex>/gs, '$$$1$$')

    // Convert newline
    latex = latex.replace(/<br>/, "\\newline")

    return latex;
  }

  static substituteSpecialChar(str) {
    str = str.replace(/\\/g, '\\textbackslash');
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
  static substituteSpecialChars(htmlString) {
    // Parse the HTML string into a DOM structure
    const excludeTags = ['code', 'math']
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Recursive function to traverse and apply text substitution to text nodes
    function traverseAndReplace(node) {
      // If the node is a text node, apply the substitution
      if (node.nodeType === Node.TEXT_NODE && !excludeTags.includes(node.tagName)) {
        LatexFileBuilder.substituteSpecialChar(node.textContent);
      }

      // If the node is an element, and it's not in the exclude list, traverse its children
      if (node.nodeType === Node.ELEMENT_NODE && !excludeTags.includes(node.tagName.toLowerCase())) {
        for (let child of node.childNodes) {
          traverseAndReplace(child);
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
    const num_cols = data.length;
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
