import { STYLE_CSS } from './styles.css.js';

export const LIVE_INDEX_HTML = (
  title,
  nav_contents,
  content,
  cover,
  print=false,
) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial scale=1.0, maximum-scale=5.0, user-scalable=yes">
    <title>${title}</title>
    <link rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css" 
          integrity="sha384-zB1R0rpPzHqg7Kpt0Aljp8JPLqbXI3bhnPWROx27a9N0Ll6ZP/+DiW/UqRcLbRjq" 
          crossorigin="anonymous">

    <style>
      ${STYLE_CSS.split('\n').join('\n\t\t\t')}
    </style>
  </head>
  <body ${print ? 'onload="window.print()"' : ''}>
    <div id="root" role="main">
      <div id="epub_cover">
        <img src="${cover}" alt="Cover image" />
      </div>
      <h1 id="epub_title">${title}</h1>

      <a id="skip_toc" href="#epub_content">Skip the table of Content</a>

      <div id="toc_container">
        <h2 id="toc_title">Contents</h2>
        <div id="toc_list">
          ${nav_contents}
        </div>
      </div>

      <div id="epub_content">
        ${content}
      </div>
    </div>
  </body>
</html>
`