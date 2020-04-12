import _ from 'lodash'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { dedent } from 'dentist'
import { api } from '../cthttp'

import { OEBPS_TOC_NCX        } from './statics/toc.ncx.js'
import { OEBPS_TOC_XHTML      } from './statics/toc.xhtml.js'
import { OEBPS_CONTENT_OPF    } from './statics/content.opf.js'
import { OEBPS_CONTENT_XHTML  } from './statics/content.xhtml.js'

export function parse_chapters(chapters) {
  return _.map(chapters, chapter => ({
    ...chapter,
    imageId: 'img-' + uuidv4(),
    image: api.getMediaFullPath(chapter.image)
  }))
}

export async function load_and_add_images(zip, chapters) {
  let coverURL = chapters[0].image
  let coverResp = await axios.get(coverURL, { responseType: 'arraybuffer' })
  zip.addFile(`OEBPS/cover.jpeg`, new Buffer(coverResp.data))

  for(let i = 0; i < chapters.length; i++) {
    let ch = chapters[i]
    let { data } = await axios.get(ch.image, { responseType: 'arraybuffer' })
    zip.addFile(`OEBPS/images/${ch.imageId}.jpeg`, new Buffer(data))
  }
}

export function get_toc_ncx(title, author, chapters) {
  let nav_points = ''
  _.forEach(chapters, (ch, index) => {
    nav_points += `
        <navPoint id="${ch.id}" playOrder="${index + 1}" class="chapter">
            <navLabel>
                <text>${index + 1}. ${ch.title}</text>
            </navLabel>
            <content src="${ch.id}.xhtml"/>
        </navPoint>
  `
  })

  return OEBPS_TOC_NCX(title, author, nav_points)
}

export function get_toc_xhtml(title, language, chapters) {
  let nav_contents = ''
  _.forEach(chapters, ch => {
    nav_contents += `
        <li class="table-of-content">
            <a href="${ch.id}.xhtml">${ch.title}</a>
        </li>
  `
  })
  return OEBPS_TOC_XHTML(title, language, nav_contents)
}

export function get_content_opf(
  title, author, language, publisher,
  date, chapters
) {
  let image0ID = api.getMediaFullPath(chapters[0].image)
  // items
  let content_items = ''
  _.forEach(chapters, ch => {
    content_items += `
        <item id="${ch.id}" href="${ch.id}.xhtml" media-type="application/xhtml+xml" />
  `
  })
  // itemrefs
  let content_items_refs = ''
  _.forEach(chapters, ch => {
    content_items_refs += `
        <itemref idref="${ch.id}"/>
  `
  })

  return OEBPS_CONTENT_OPF(
    title, author, language, publisher, 
    date, image0ID, 
    content_items, content_items_refs
  )
}


function html2xhtml(html) {
  if (!html) return null
  html = _.replace(html, /&nbsp;/g, '&#160;')
  var doc = new DOMParser().parseFromString(html, 'text/html');
  html = new XMLSerializer().serializeToString(doc) 
  html = html.split('body')[1]
  html = html.substring(1, html.length-2)
  return html
}

export function get_content_xhtml(chapter, language) {
  let { title, text, imageId, audioDescription } = chapter
  
  text = html2xhtml(text)
  audioDescription = html2xhtml(audioDescription)

  let content = dedent(`
    ${
      audioDescription ?
      dedent(`
        <div class="ee-preview-text-con description">
            ${audioDescription}
        </div>
      `)
      :
      ''
    }
    <div class="ee-preview-text-con">
        ${text}
    </div>
  `)
  console.log(text)
  return OEBPS_CONTENT_XHTML(title, content, imageId, language)
}