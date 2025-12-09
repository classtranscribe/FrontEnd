import showdown from 'showdown';
import showdownKatex from 'showdown-katex';

function getMDConverter() {
  return new showdown.Converter({
    tables: true,
    simpleLineBreaks: true,
    strikethrough: true,
    parseImgDimensions: true,
    simplifiedAutoLink: true,
    excludeTrailingPunctuationFromURLs: true,
    tasklists: true,
    underline: true,
    extensions: [showdownKatex({})],
  });
}

/**
 * Escape hash symbols that shouldn't be treated as headers
 * Hash symbols at the start of a line followed by a space are headers
 * Hash symbols not at the start of a line or not followed by a space should be escaped
 * @param {String} markdownData raw markdown text
 * @returns {String} markdown with hash symbols escaped
 */
function escapeHashSymbols(markdownData) {
  if (!markdownData) return markdownData;
  
  let inCodeBlock = false;
  const lines = markdownData.split('\n');
  const processedLines = [];
  
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx += 1) {
    const line = lines[lineIdx];
    
    // Check for code block markers (triple backticks)
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      processedLines.push(line);
    } else if (inCodeBlock) {
      // If we're inside a code block, don't modify the line
      processedLines.push(line);
    } else if (/^#+\s/.test(line)) {
      // If line starts with # followed by space, it's a header - keep it
      processedLines.push(line);
    } else {
      // Otherwise, escape hash symbols in the line
      // But preserve hash symbols inside inline code (between single backticks)
      let inInlineCode = false;
      let result = '';
      
      for (let i = 0; i < line.length; i += 1) {
        const char = line[i];
        
        // Check for inline code markers (single backtick)
        if (char === '`') {
          // Check if it's not part of triple backticks (we already handled those)
          inInlineCode = !inInlineCode;
          result += char;
        } else if (inInlineCode) {
          // If we're in inline code, don't escape hash
          result += char;
        } else if (char === '#') {
          // Escape hash symbols that aren't part of headers
          result += '\\#';
        } else {
          result += char;
        }
      }
      
      processedLines.push(result);
    }
  }
  
  return processedLines.join('\n');
}

/**
 * Parse markdown input to html
 * @param {String} markdownData raw markdown text
 * @returns {String} parsed raw html
 */
export function markdown2Html(markdownData) {
  const md = getMDConverter();
  // Escape hash symbols before markdown conversion
  const escapedMarkdown = escapeHashSymbols(markdownData);
  return md.makeHtml(escapedMarkdown);
}
