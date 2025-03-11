import { jsPDF as JsPDF } from 'jspdf';

function newPDF() {
  return new JsPDF("portrait", "px", "a4");
};

const placeholderImg = 'data:image/png;base64,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'
// Sizes are in pixels
// Colors are in black and white with 0 black, and 255 white
const STYLE_SHEET = {
  latex: {
    scale: 1 / 24 / 20
  },
  font: {
    glossary: {
      color: 0,
      size: 12,
      align: 'left'
    },
    altText: {
      color: 0,
      size: 10,
      align: 'left'
    },
    imgDescription: {
      color: 100,
      size: 12,
      align: 'left'
    },
    body: {
      color: 0,
      size: 15,
      align: 'left',
      style: 'normal'
    },
    chapterTitle: {
      color: 0,
      size: 20,
      align: 'center'
    },
    title: {
      color: 0,
      size: 30,
      align: 'center'
    },
    link: {
      color: '#0000EE'
    },
    header: {
      h1: {
        size: 30,
        style: 'bold',
      },
      h2: {
        size: 25,
        style: 'bold',
      },
      h3: {
        size: 20,
        style: 'bold',
      },
      h4: {
        size: 15,
        style: 'bold',
      },
      h5: {
        size: 12,
        style: 'bold',
      },
      h6: {
        size: 10,
        style: 'bold',
      },
    },
  },
  vertEdgeMargin: 20,
  edgeMargin: 40,
  spacing: 20,
  image: {
    imageAltGap: 10,
    AltDescGap: 5,
    DescDescGap: 10
  },
  blockquote: {
    indentSize: 10,
    vertMargin: 5,
    color: {
      r: 0,
      g: 255,
      b: 255
    }
  },
  table: {
    cellBottomMargin: 2,
    cellLeftMargin: 2
  },
  visualTOC: {
    imagesPerRow: 2,
    hMargin: 10,
    font: {
      size: 12,
      color: "#0000EE"
    },
    vSpacing: 50,
    maxLines: 3,
    topMargin: 40
  },
  TOC: {
    vSpacing: 10,
    font: {
      size: 12,
      color: "#0000EE"
    },
    hMargin: 30,
    topMargin: 40
  }
}

export { newPDF, STYLE_SHEET, placeholderImg }