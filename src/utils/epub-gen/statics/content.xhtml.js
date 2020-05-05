import { dedent } from 'dentist'

/**
 * String data of OEBPS/content.xhtml
 * @param {String} title ePub title
 * @param {String} content ePub content
 * @param {String} imageId ePub cover image
 * @param {String} language ePub language
 */
export const OEBPS_CONTENT_XHTML = (title, content, imageId, language) => dedent(`
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${language}">
    <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
        <link rel="stylesheet" type="text/css" href="style.css" />
        <link rel="stylesheet" type="text/css" href="katex.min.css" />
    </head>
    <body>
        ${content}
    </body>
</html>
`)