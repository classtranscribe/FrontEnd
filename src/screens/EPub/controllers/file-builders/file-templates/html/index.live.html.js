import raw from 'raw.macro';
import { ROOT_CSS, PRISM_CSS } from '../styles';

export const STYLE_CSS = raw('./style.css') + ROOT_CSS;

export default ({
  title = '',
  navContents = '',
  content = '',
  cover = {},
  author = '',
  print = false
}) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial scale=1.0, maximum-scale=5.0, user-scalable=yes">
    <title>${title}</title>
    <link rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css" 
          integrity="sha384-zB1R0rpPzHqg7Kpt0Aljp8JPLqbXI3bhnPWROx27a9N0Ll6ZP/+DiW/UqRcLbRjq" 
          crossorigin="anonymous">
    <style>${PRISM_CSS}</style>
    <style>${STYLE_CSS}</style>
  </head>
  <body ${print ? 'onload="window.print()"' : ''}>
    <div id="root" role="main">
      <div id="epub_cover">
        <img src="${cover.src}" alt="${cover.alt}" />
      </div>
      <h1 id="epub_title">${title}</h1>
      <div id="epub_author">${author}</div>

      <a id="skip_toc" href="#epub_content">Skip the table of Content</a>
      <div id="toc_container">
        <h2 id="toc_title">Contents</h2>
        <div id="toc_list">
          ${navContents}
        </div>
        <div id="epub_content">
            ${content}
        </div>

      </div>
    </div>
  </body>
</html>
`;
