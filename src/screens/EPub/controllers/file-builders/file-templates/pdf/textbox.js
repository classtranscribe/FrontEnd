/* eslint-disable no-console */
/* eslint-disable no-unreachable */
import _ from "lodash";
import { html } from "utils";
import { STYLE_SHEET } from "./pdfstyle";


export class TextBox {
  static write(owner, text, options) {
    let tb = new TextBox(owner, options)
    tb.writeAll(text)
  }

  constructor(owner, init_text_style = STYLE_SHEET.font.body) {
    this.owner = owner;
    this.doc = owner.doc;
    this.setYLoc = (y_loc) => { owner.y_loc = y_loc };
    this.getYLoc = (height) => { return owner.getYLoc(height) };
    this.incrementYLoc = (height, allow_new_page) => { return owner.incrementYLoc(height, allow_new_page) };

    this.beginBlockQuoteYLocs = [];
    this.doc.setFillColor(STYLE_SHEET.blockquote.color.r, STYLE_SHEET.blockquote.color.g, STYLE_SHEET.blockquote.color.b)

    // state variables that track current and past text formatting/positioning
    this.line_start = STYLE_SHEET.edgeMargin;
    this.line_end = this.doc.getPageWidth() - STYLE_SHEET.edgeMargin;
    this.x_loc = this.line_start;
    this.setTextOptions(init_text_style);
    this.text_options_stack = [];
    this.lines = 0;
    this.allow_new_page = true;
    // double spaced text is separated only by p tags, but new lines of p tags
    // 
    this.first_p_seen = true;

    // state variables that track what is currently being printed
    this.linking = false;
    this.link_target = "";
    this.bullet_point = false;
    this.numbered_list = false;
    this.list_index = 0;

    // callbacks that handle the start and stop of each tag
    this.callbacks = {
      // this tag begins and ends every text block
      "body": {
        'start': () => { },
        'end': () => { }
      },

      // Bullet point section
      "ul": {
        'start': () => {
          this.nextLine();
          this.bullet_point = true;
        },
        'end': () => { this.bullet_point = false; }
      },

      // Numbered list section
      "ol": {
        'start': () => {
          this.nextLine();
          this.list_index = 0;
          this.numbered_list = true;
        },
        'end': () => { this.numbered_list = false; }
      },

      // Bullet point or numbered list
      "li": {
        'start': () => {
          if (this.bullet_point) {
            this.writeTextSimple(' \u2022 ');
          } else if (this.numbered_list) {
            this.writeTextSimple(` ${this.list_index + 1}. `);
            this.list_index += 1;
          } else {
            console.log("error, not bullet or numbered list");
          }
        },
        'end': () => { this.nextLine(); }
      },

      // paragraph, do nothing
      "p": {
        'start': () => {
          if (!this.bullet_point && !this.first_p_seen) {
            this.nextLine();
            this.first_p_seen = false;
          }
        },
        'end': () => {
          this.nextLine();
        }
      },

      "br": {
        'start': () => { this.nextLine(); },
        'end': () => { }
      },

      // blockquote
      "blockquote": {
        'start': () => {
          this.beginBlockQuoteYLocs.push(this.getYLoc(this.line_height));
          this.line_start += STYLE_SHEET.blockquote.indentSize;
          this.incrementYLoc(STYLE_SHEET.blockquote.vertMargin);
        },
        'end': () => {
          this.drawBlockQuote(this.beginBlockQuoteYLocs.pop(), this.getYLoc(0));
          this.line_start -= STYLE_SHEET.blockquote.indentSize;
          this.incrementYLoc(STYLE_SHEET.blockquote.vertMargin);
        }
      },

      // Link
      "a": {
        'start': (node) => {
          this.link_target = node.href;
          this.linking = true;
          this.pushTextType(STYLE_SHEET.font.link)
        },
        'end': () => {
          this.linking = false;
          this.popTextType();
        }
      },
      // code block
      "code": {
        'start': () => {
          this.doc.setFont('Courier');
        },
        'end': () => {
          this.doc.setFont('Helvetica');
        }
      },

      // Bold
      "strong": {
        'start': () => { this.pushTextType({ style: 'bold' }); },
        'end': () => { this.popTextType(); }
      },
      // Italic (doesn't support bold and italic simultaneously)
      "em": {
        'start': () => { this.pushTextType({ style: 'italic' }); },
        'end': () => { this.popTextType(); }
      },

      // Tables (do nothing, since this will be handled by drawTable)
      "table": {
        'start': () => { },
        'end': () => { }
      },

      // Various header sizes, from largest to smallest
      "h1": {
        'start': () => {
          this.pushTextType(STYLE_SHEET.font.header.h1);
          this.nextLine();
        },
        'end': () => {
          this.nextLine();
          this.popTextType();
        }
      },
      "h2": {
        'start': () => {
          this.pushTextType(STYLE_SHEET.font.header.h2);
          this.nextLine();
        },
        'end': () => {
          this.nextLine();
          this.popTextType();
        }
      },
      "h3": {
        'start': () => {
          this.pushTextType(STYLE_SHEET.font.header.h3);
          this.nextLine();
        },
        'end': () => {
          this.nextLine();
          this.popTextType();
        }
      },
      "h4": {
        'start': () => {
          this.pushTextType(STYLE_SHEET.font.header.h4)
          this.nextLine();
        },
        'end': () => {
          this.nextLine();
          this.popTextType();
        }
      },
      "h5": {
        'start': () => {
          this.pushTextType(STYLE_SHEET.font.header.h5);
          this.nextLine();
        },
        'end': () => {
          this.nextLine();
          this.popTextType();
        }
      },
      "h6": {
        'start': () => {
          this.pushTextType(STYLE_SHEET.font.header.h6);
          this.nextLine();
        },
        'end': () => {
          this.nextLine();
          this.popTextType();
        }
      },
    }
  }

  nextLine() {
    this.lines += 1;
    this.x_loc = this.line_start;
    this.incrementYLoc(this.curr_text_options.size, this.allow_new_page);
  }

  getXLoc(expected_size) {
    if (expected_size > this.line_end - this.line_start) {
      // size overflows a single line
      this.nextLine();
    } else if (this.x_loc + expected_size > this.line_end) {
      this.nextLine();
    }
    return this.x_loc;
  }

  incrementXLoc(diff) {
    if (this.x_loc + diff > this.doc.getPageWidth() - STYLE_SHEET.edgeMargin) {
      this.nextLine();
    } else {
      this.x_loc += diff;
    }
  }

  drawBlockQuote(startYloc, endYLoc) {
    // this.doc.rect(this.line_start - 10, startYloc, 5, endYLoc - startYloc, 'F');
  }

  pushTextType(options) {
    this.text_options_stack.push(this.curr_text_options);
    this.setTextOptions(options);
  }
  popTextType() {
    this.setTextOptions(this.text_options_stack.pop());
  }

  setTextOptions({ color, size, style }) {
    if (color !== undefined) {
      this.doc.setTextColor(color);
    } else {
      color = this.doc.getTextColor()
    }
    if (size !== undefined) {
      this.doc.setFontSize(size);
    } else {
      size = this.doc.getFontSize();
    }
    if (style !== undefined) {
      if ((style === 'bold' && this.curr_text_options.style === 'italic') ||
        (style === 'italic' && this.curr_text_options.style === 'bold')) {
        style = 'bolditalic';
      }
      this.doc.setFont(undefined, style);
    } else {
      style = this.doc.getFont().fontStyle
    }
    // console.log("set text options", color, size, style);
    this.curr_text_options = { color, size, style };
  }

  writeAll(text) {
    const latexStripped = text.replace(/\$\$(.*?)\$\$/g, '<latex>$1</latex>');
    const htmlString = html.markdown(latexStripped);
    const root = this.parseHTML(htmlString);
    this.traverseDOM(root, []);
  }
  writeTextSimple(text) {
    this.doc.text(text, this.getXLoc(this.doc.getTextWidth(text)), this.getYLoc())
    this.incrementXLoc(this.doc.getTextWidth(text));
  }

  writeWordsToPDF(text) {
    let words = text.split(" ");

    // if line_height is zero, getYLoc(line_height) never moves to new page
    let line_height = this.allow_new_page ? this.curr_text_options.size : 0;

    _.forEach(words, (word) => {
      const word_len = this.doc.getTextWidth(`${word}`);
      if (word_len > this.line_end - this.line_start) {
        let split_word = this.doc.splitTextToSize(`${word}`, this.line_end - this.line_start);
        console.log("split, len", split_word, word_len, this.line_end - this.line_start);
        this.writeWordsToPDF(split_word.join(" "));
      } else if (this.phony_write) {
        this.incrementXLoc(this.doc.getTextWidth(`${word} `));
      } else if (this.linking) {
        this.doc.textWithLink(`${word} `, this.getXLoc(word_len), this.getYLoc(line_height), { url: this.link_target });
        this.incrementXLoc(this.doc.getTextWidth(`${word} `));
      } else {
        this.doc.text(`${word} `, this.getXLoc(word_len), this.getYLoc(line_height));
        this.incrementXLoc(this.doc.getTextWidth(`${word} `));
      }
    });
  }
  parseHTML(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    return doc.body; // The parsed HTML content
  }

  // Warning: this will explode if the table crosses page boundaries
  drawTable(table) {
    const save_y_loc = () => {
      this.saved_y_loc = this.getYLoc(0);
    }
    const load_y_loc = () => {
      this.setYLoc(this.saved_y_loc);
    }
    const data = [];

    // parse <thead> (Header Row)
    const thead = table.querySelector('thead');
    if (thead) {
      const headerRow = Array.from(thead.querySelectorAll('tr th'));
      data.push(headerRow);
    }

    // parse <tbody> (Data Rows)
    const tbody = table.querySelector('tbody');
    if (tbody) {
      const rows = Array.from(tbody.querySelectorAll('tr'));
      rows.forEach(row => {
        const rowData = Array.from(row.querySelectorAll('td'));
        data.push(rowData);
      });
    }

    // setup
    const stored_line_start = this.line_start;
    const stored_line_end = this.line_end;
    const num_cols = data[0].length;
    const num_rows = data.length;
    const row_width = (this.line_end - this.line_start) / num_cols;
    const bMargin = STYLE_SHEET.table.cellBottomMargin;
    this.owner.nextPage();
    this.allow_new_page = false;
    let end_y_loc = this.getYLoc();
    let start_y_loc = this.getYLoc() - this.curr_text_options.size;

    // print table
    this.doc.line(stored_line_start, start_y_loc, stored_line_end, start_y_loc);
    this.pushTextType({ style: 'bold' });
    for (let row = 0; row < num_rows; row += 1) {
      let max_lines = 1;
      save_y_loc();
      for (let col = 0; col < num_cols; col += 1) {
        // console.log("stored start, stored end, col", stored_line_start)
        this.lines = 1
        this.line_start = stored_line_start + row_width * col;
        this.line_end = this.line_start + row_width;
        this.x_loc = this.line_start;
        // console.log("row_width, line_start, line_end, x_loc", row_width, this.line_start, this.line_end, this.x_loc);

        this.traverseDOM(data[row][col]);
        if (this.lines > max_lines) {
          max_lines = this.lines;
        }
        // console.log("max_lines", max_lines);
        load_y_loc();
      }
      if (row === 0) {
        this.popTextType();
      }
      this.doc.line(stored_line_start, this.getYLoc() + bMargin, stored_line_end, this.getYLoc() + bMargin);
      end_y_loc = this.getYLoc() + bMargin;
      this.incrementYLoc(max_lines * this.curr_text_options.size * 1.1, this.allow_new_page);
    }

    // draw vertical lines
    for (let col = 0; col < num_cols + 1; col += 1) {
      const x_val = stored_line_start + row_width * col
      this.doc.line(x_val, start_y_loc, x_val, end_y_loc);
    }


    // cleanup
    this.line_start = stored_line_start;
    this.line_end = stored_line_end;
    this.allow_new_page = true;
    this.x_loc = this.line_start;
  }

  onEnterNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      this.writeWordsToPDF(node.nodeValue);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName.toLowerCase() in this.callbacks) {
        this.callbacks[node.tagName.toLowerCase()].start(node);
      } else {
        console.log(`${node.tagName.toLowerCase()} has no enter handler, doing nothing`);
      }
    }
  }

  onExitNode(node) {
    if (node.tagName.toLowerCase() in this.callbacks) {
      this.callbacks[node.tagName.toLowerCase()].end(node);
    } else {
      console.log(`${node.tagName.toLowerCase()} has no exit handler, doing nothing`);
    }
  }

  traverseDOM(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      this.onEnterNode(node);
    } else if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
      this.onEnterNode(node); // Handle text nodes if needed
    }

    if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'table') {
      this.drawTable(node);
    } else {
      for (let child of node.childNodes) {
        this.traverseDOM(child); // Preserve ancestor hierarchy
      }
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      this.onExitNode(node);
    }
  }
}