export default ({
  title = '',
  navContents = '',
  content = '',
  author = '',
  cover = ''
}) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial scale=1.0, maximum-scale=5.0, user-scalable=yes">
    <title>${title}</title>
    <link rel="stylesheet" type="text/css" href="styles/style.css" />
    <link rel="stylesheet" type="text/css" href="styles/katex.min.css" />
    <link rel="stylesheet" type="text/css" href="styles/prism.css" />
  </head>
  <body>
    <div id="root" role="main">
      <img id="epub_cover" src="images/cover.jpeg" alt="Cover image" />
      <div id="epub_cover">
        <img src="${cover}" alt="Cover image" />
      </div>
      <h1 id="epub_title">${title}</h1>
      <div id="epub_author">${author}</div>

      <a id="skip_toc" href="#epub_content">Skip the table of Content</a>

      <div id="toc_container">
        <h2 id="toc_title">Contents</h2>
        <div id="toc_list">
          ${navContents}
        </div>
      </div>

      <div id="epub_content">
        ${content}
      </div>
    </div>
  </body>
</html>
`;
