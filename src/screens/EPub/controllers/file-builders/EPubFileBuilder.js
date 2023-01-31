import _ from 'lodash';
import AdmZip from 'adm-zip';
import { dedent } from 'dentist';
import { EPubData } from 'entities/EPubs';
import { AmpStories } from '@material-ui/icons';
import { links } from 'utils';
import EPubParser from './EPubParser';
import { KATEX_MIN_CSS, PRISM_CSS } from './file-templates/styles';
import {getGlossaryData, findGlossaryTermsInChapter, glossaryTermsAsHTML, highlightAndLinkGlossaryWords} from './GlossaryCreator';
import {
  MIMETYPE,
  META_INF_CONTAINER_XML,
  OEBPS_STYLE_CSS,
  OEBPS_TOC_NCX,
  OEBPS_TOC_XHTML,
  OEBPS_CONTENT_OPF,
  OEBPS_CONTENT_XHTML
} from './file-templates/epub';

/**
 * File buffer builder for .epub
 */
class EPubFileBuilder {
  /**
   * Create an EPubFileBuilder
   * @param {EPubData} ePubData 
   */
  constructor() {
    this.zip = new AdmZip();
  }

  async init(ePubData) {
    this.data = await EPubParser.parse(ePubData);
    this.h3 = ePubData.h3;
    this.glossaryData = await getGlossaryData(this.data.sourceId);
    // console.log(this.glossaryData);
  }

  /**
   * Convert an EPubData object to a downloadable epub file buffer
   * @param {EPubData} ePubData 
   * @returns {Buffer} epub file buffer
   */
  static async toBuffer(ePubData) {
    const builder = new EPubFileBuilder();
    await builder.init(ePubData);
    const buffer = await builder.getEPubBuffer();
    return buffer;
  }

  async insertImagesToZip() {
    // we embeded image into html
    /*
    const { cover, chapters } = this.data;
    const { coverBuffer, images } = 
      await EPubParser.loadEPubImageBuffers({ chapters, cover });

    this.zip.addFile(`OEBPS/cover.jpeg`, coverBuffer);
    _.forEach(images, (img) => {
      this.zip.addFile(`OEBPS/${img.relSrc}`, img.buffer);
    });
    */
  }

  getTocNCX() {
    const { title, author, chapters } = this.data;
    let navPoints = '';
    let playOrder = 0;
    let selectedChapters = [];
    for (let i = 0; i < chapters.length; i+= 1) {
      for (const [key, value] of Object.entries(this.data.condition)) {
        if (key === 'default') {
          if (value === true && (!chapters[i].condition || chapters[i].condition.find(elem => elem === key) !== undefined)) {
            selectedChapters.push(chapters[i]);
            break;
          }
        } else if (value === true && (chapters[i].condition && chapters[i].condition.find(elem => elem === key) !== undefined)) {
            selectedChapters.push(chapters[i]);
            break;
          }  
      }
    }
  
    const getPlayOrder = () => {
      playOrder += 1;
      return playOrder;
    };
  
    _.forEach(selectedChapters, (ch, index) => {
      navPoints += `
        <navPoint id="${ch.id}" playOrder="${getPlayOrder()}" class="chapter">
            <navLabel>
                <text>${index + 1} - ${ch.title}</text>
            </navLabel>
            <content src="${ch.id}.xhtml"/>

            ${_.map(
              ch.subChapters,
              (subCh, subIndex) => `
            <navPoint id="${subCh.id}" playOrder="${getPlayOrder()}">
                <navLabel>
                    <text>${index + 1}.${subIndex + 1} - ${subCh.title}</text>
                </navLabel>
                <content src="${ch.id}.xhtml#${subCh.id}" />
            </navPoint>`,
            ).join('\n\t\t\t\t')}
        </navPoint>
        `;
    });
  
    return OEBPS_TOC_NCX({ title, author, navPoints });
  }

  getTocXHTML() {
    const { title, language, chapters, sourceId } = this.data;
    let navContents = '';
    let selectedChapters = [];
    for (let i = 0; i < chapters.length; i+= 1) {
      for (const [key, value] of Object.entries(this.data.condition)) {
        if (key === 'default') {
          if (value === true && (!chapters[i].condition || chapters[i].condition.find(elem => elem === key) !== undefined)) {
            selectedChapters.push(chapters[i]);
            break;
          }
        } else if (value === true && (chapters[i].condition && chapters[i].condition.find(elem => elem === key) !== undefined)) {
            selectedChapters.push(chapters[i]);
            break;
          }  
      }
    }
   
    _.forEach(selectedChapters, (ch, index) => {  
      // visual toc logic 
      let image = "";
      if (this.data.enableVisualToc) {
        // get image from chapter text 
        let divStart = ch.text.indexOf('<div'); 
        let altTextIndex = ch.text.indexOf('alt=')
        image = ch.text.substring(divStart, altTextIndex);
        // set image size and alt text 
        if (image) {
          image += 'alt="'; 
          image += ch.title; 
          image += '" ';
          image += 'width="70%"';
          image += '/>';
          image += '</div>';
        } 
      }

      // adds toc entry 
      navContents += `
        <dt class="table-of-content">  
          <a href="${ch.id}.xhtml">${index + 1} - ${ch.title} ${image} </a>
        </dt>
        ${_.map(
          ch.subChapters,
          (subCh, subIndex) => `
            <dd>
                <a href="${ch.id}.xhtml#${subCh.id}">
                    ${index + 1}.${subIndex + 1} - ${subCh.title}
                </a>
            </dd>`,
        ).join('\n\t\t\t')}
        `;
    });
  
    return OEBPS_TOC_XHTML({ title, language, navContents });
  }

  getContentOPF() {
    const { title, author, language, publisher, chapters} = this.data;
    // image items
    let selectedChapters = [];
    for (let i = 0; i < chapters.length; i+= 1) {
      for (const [key, value] of Object.entries(this.data.condition)) {
        if (key === 'default') {
          if (value === true && (!chapters[i].condition || chapters[i].condition.find(elem => elem === key) !== undefined)) {
            selectedChapters.push(chapters[i]);
            break;
          }
        } else if (value === true && (chapters[i].condition && chapters[i].condition.find(elem => elem === key) !== undefined)) {
            selectedChapters.push(chapters[i]);
            break;
          }  
      }
    }
    const images = _.flatten(_.map(selectedChapters, (ch) => ch.images));
    const imageItems = _.map(
      images,
      (img) => `
      <item id="${img.id}" href="images/${img.id}.jpeg" media-type="image/jpeg" />`,
    ).join('\n\t\t');
    
    // content items
    const contentItems = _.map(
      selectedChapters,
      (ch) => `<item id="${ch.id}" href="${ch.id}.xhtml" media-type="application/xhtml+xml" />`,
    ).join('\n\t\t');
  
    // content itemrefs
    const contentItemsRefs = _.map(selectedChapters, (ch) => `<itemref idref="${ch.id}"/>`).join('\n\t\t');
  
    return OEBPS_CONTENT_OPF({
      title,
      author,
      language,
      publisher,
      date: new Date(),
      imageItems,
      contentItems,
      contentItemsRefs
    });
  }

  getContentXHTML(chapter) {
    const { language, sourceId } = this.data;
    let { title, text, start, link } = chapter;
    let h = parseInt(start.substring(0, 2),10);
    let m = parseInt(start.substring(3, 5),10);
    let s = parseInt(start.substring(6,8),10);
    let curTime = 3600 * h + 60 * m + s;
    let imgStart = text.indexOf('<img');
    let imgEnd = text.indexOf('</div>');
    let url = window.location.href;
    let query = url.indexOf('/epub');
    url = url.substring(0, query);
    let sub1 = text.substring(0, imgStart-4);
    let sub2 = "<a href='".concat(url,links.watch(sourceId),"&begin=",curTime,"'>\n").replace('&', '&amp;');
    let sub3 = text.substring(imgStart,imgEnd);
    let sub4 = "</a>\n";
    let sub5 = text.substring(imgEnd);
    text = sub1.concat(sub2,sub3,sub4,sub5);
    if (link !== undefined && link.startsWith('http')) {
      text = "<a href='".concat(link, "'>Slides</a>\n", text);
    }
    
    // add glossary terms to end of chapter
    console.log(this.data.sourceId, this.glossaryData);

    const glossaryTerms = findGlossaryTermsInChapter(this.glossaryData, text);
    const highlightedText = highlightAndLinkGlossaryWords(text, glossaryTerms);
    const glossaryHTML = glossaryTermsAsHTML(glossaryTerms);

    const content = dedent(`
        <div class="epub-ch">            
            ${highlightedText}
            ${glossaryHTML} 
        </div>
      `);
    return OEBPS_CONTENT_XHTML({ title, content, language });
  }
  
  async getEPubBuffer() {
    const { title, author, language, chapters, cover } = this.data;
    const zip = this.zip;

    // OEBPS/cover.jpeg
    // OEBPS/images/image-id.jpeg
    await this.insertImagesToZip(chapters, cover);

    // mimetype
    zip.addFile('mimetype', Buffer.from(MIMETYPE));
    // META-INF/container.xml
    zip.addFile('META-INF/container.xml', Buffer.from(META_INF_CONTAINER_XML));

    // OEBPS
    // OEBPS/style.css
    zip.addFile('OEBPS/style.css', Buffer.from(OEBPS_STYLE_CSS));
    // OEBPS/katex.min.css
    zip.addFile('OEBPS/katex.min.css', Buffer.from(KATEX_MIN_CSS));
    // OEBPS/prism.css
    zip.addFile('OEBPS/prism.css', Buffer.from(PRISM_CSS));

    // OEBPS/toc.ncx
    const toxNCX = this.getTocNCX(title, author, chapters);
    zip.addFile('OEBPS/toc.ncx', Buffer.from(toxNCX));
    // OEBPS/toc.xhtml
    const tocXHTML = this.getTocXHTML(title, language, chapters);
    zip.addFile('OEBPS/toc.xhtml', Buffer.from(tocXHTML));

    // OEBPS/content.opf
    const contentOPF = this.getContentOPF(
      title,
      author,
      language,
      'ClassTranscribe',
      new Date(),
      chapters,
    );
    zip.addFile('OEBPS/content.opf', Buffer.from(contentOPF));
    
    let selectedChapters = [];
    for (let i = 0; i < chapters.length; i+= 1) {
      for (const [key, value] of Object.entries(this.data.condition)) {
        if (key === 'default') {
          if (value === true && (!chapters[i].condition || chapters[i].condition.find(elem => elem === key) !== undefined)) {
            selectedChapters.push(chapters[i]);
            break;
          }
        } else if (value === true && (chapters[i].condition && chapters[i].condition.find(elem => elem === key) !== undefined)) {
            selectedChapters.push(chapters[i]);
            break;
          }  
      }
    }

    // OEBPS/chapter-id.xhtml
    _.forEach(selectedChapters, (ch) => {
      const contentXHTML = this.getContentXHTML(ch, language);
      zip.addFile(`OEBPS/${ch.id}.xhtml`, Buffer.from(contentXHTML));
    });

    return zip.toBuffer();
  }
}

export default EPubFileBuilder;