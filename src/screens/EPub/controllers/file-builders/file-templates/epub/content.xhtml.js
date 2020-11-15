import { dedent } from 'dentist';

export default ({
  title = '', 
  content = '', 
  language = ''
}) => dedent(`
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${language}">
    <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
        <link rel="stylesheet" type="text/css" href="style.css" />
        <link rel="stylesheet" type="text/css" href="katex.min.css" />
        <link rel="stylesheet" type="text/css" href="prism.css" />
    </head>
    <body>
    <div id="root" role="main">
        ${content}
    </div>
    </body>
</html>
`);