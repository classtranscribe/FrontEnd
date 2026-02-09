import _ from 'lodash';
import { html, _buildID } from 'utils';
import EPubParser from 'screens/EPub/controllers/file-builders/EPubParser';

export function buildMDFromItems(items) {
  if (!items || items.length === 0) return '';
  return [
    '\n#### Transcript',
    _.map(items, (item) => _.trim(item.text)).join(' ')
  ].join('\n');
}

// eslint-disable-next-line complexity
export async function buildMDFromContent(content) {
  if (typeof content === 'string') return content;
  
  // unwrap __data__ for correct image loading in subchapters 
  if ("__data__" in content) {
    content = JSON.parse(JSON.stringify(content.__data__))
  }

  if (!content || !content.src) {
    console.warn('buildMDFromContent: Invalid content, missing src:', content);
    return '<div class="img-block"><p><em>Image not available</em></p></div>';
  }
  const src = content.src;

  let img_data_url = null;
  let imgError = false;
  
  try {
    // loadImageBuffer expects the src and will call uurl.getMediaUrl internally
    const img = await EPubParser.loadImageBuffer(src);
    
    // Check if image buffer is valid (not empty string)
    if (!img || (typeof img === 'string' && img === '')) {
      throw new Error('Empty image buffer returned');
    }
    
    const img_blob = new Blob([img]);
    img_data_url = await EPubParser.blobToDataUrl(img_blob);
    
    // Verify data URL was created
    if (!img_data_url || img_data_url === '') {
      throw new Error('Failed to create data URL from image blob');
    }
  } catch (error) {
    imgError = true;
    console.warn('buildMDFromContent: Error loading image:', error, 'src:', src);
    // Try to use the original src as fallback
    img_data_url = src;
  }

  if (!img_data_url || img_data_url === '') {
    console.warn('buildMDFromContent: No valid image URL, using placeholder');
    img_data_url = '';
  }

  let link_url = content.link || '';
  // if (content.timestamp) {
  //   link_url = links.watch(epub.sourceId, { begin: TimeString.toSeconds(timestamp) })
  // }

  let despId = _buildID();
  const descriptions = content.descriptions || [];
  const descriptionsHtml = descriptions.length !== 0 
    ? `\t<div id="${despId}">${html.markdown(descriptions.join("\n"))}</div>` 
    : '';
  
  // If image failed to load, show error message
  const imgTag = imgError && !img_data_url
    ? `\t<img src="" alt="${content.alt || 'Image not available'}" aria-describedby="${despId}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />\n\t<p style="display:none; color: red;"><em>Image failed to load: ${content.src}</em></p>`
    : `\t<img src="${img_data_url}" alt="${content.alt || ''}" aria-describedby="${despId}" />`;
  
  return [
    '<div class="img-block">',
    (link_url && link_url !== "") ? `<a href="${link_url}">` : "",
    imgTag,
    (link_url && link_url !== "") ? `</a>` : "",
    descriptionsHtml,
    '</div>'
  ].join('\n');
}

export async function buildMDFromSubChapter({ id, title, contents }) {
  return [
    `<!-- Sub-Chapter -->\n<h3 data-sub-ch id="${id}">${title}</h3>\n\n`,
    (await Promise.all(_.map(contents, buildMDFromContent))).join('\n\n')
  ].join('\n\n');
}

export async function buildMDFromChapter({ id, contents, subChapters, title }) {
  return [
    `<!-- Chapter -->\n<h2 data-ch id="${id}">${title}</h2>`,
    (await Promise.all(_.map(contents, buildMDFromContent))).join('\n\n'),
    (await Promise.all(_.map(subChapters, buildMDFromSubChapter))).join('\n\n')
  ].join('\n\n\n');
}

export async function buildMDFromChapters(chapters) {
  return (await Promise.all(_.map(chapters, buildMDFromChapter))).join('\n\n');
}

export function buildHTMLFromMD(text) {
  return html.markdown(text);
}

export async function buildHTMLFromChapter(chapter) {
  return html.markdown(await buildMDFromChapter(chapter));
}

// Function to encode special XML characters in a string
export function encodeXmlEntities(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    /* eslint-disable */
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ''); // Remove control characters
  /* eslint-enable */
}