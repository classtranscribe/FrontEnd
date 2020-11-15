import { dedent } from 'dentist';

export default ({
  title = '', 
  author = '', 
  navPoints = ''
}) =>
  dedent(`
<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
    <head>
        <meta name="dtb:uid" content="1fc37579-81ab-4483-b1bc-3270f17f9afd" />
        <meta name="dtb:generator" content="ct-epub-gen"/>
        <meta name="dtb:depth" content="1"/>
        <meta name="dtb:totalPageCount" content="0"/>
        <meta name="dtb:maxPageNumber" content="0"/>
    </head>
    <docTitle>
        <text>${title}</text>
    </docTitle>
    <docAuthor>
        <text>${author}</text>
    </docAuthor>
    <navMap>
        <navPoint id="toc" playOrder="0" class="chapter">
            <navLabel>
                <text>Table Of Contents</text>
            </navLabel>
            <content src="toc.xhtml"/>
        </navPoint>
        ${navPoints}
    </navMap>
</ncx>
`);
