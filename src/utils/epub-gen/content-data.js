export const MIMETYPE = 'application/epub+zip'

export const META_INF_CONTAINER_XML = '<?xml version="1.0" encoding="UTF-8" ?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>'

export const OEBPS_STYLE_CSS = `
.epub-author {
  color: #555;
}

.epub-link {
  margin-bottom: 30px;
}

.epub-link a {
  color: #666;
  font-size: 90%;
}

.toc-author {
  font-size: 90%;
  color: #555;
}

.toc-link {
  color: #999;
  font-size: 85%;
  display: block;
}

hr {
  border: 0;
  border-bottom: 1px solid #dedede;
  margin: 60px 10%;
}

p {
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji" !important;
}
`


// TITLE, AUTHOR, NAV_POINTS
export const OEBPS_TOC_NCX = (title, author, nav_points) => `<?xml version="1.0" encoding="UTF-8"?>
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
        ${nav_points}
    </navMap>
</ncx>
`

// TITLE, NAV_CONTENTS, LANGUAGE
export const OEBPS_TOC_XHTML = (title, language, nav_contents) => `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${language}" lang="${language}">
<head>
    <title>${title}</title>
    <meta charset="UTF-8" />
    <link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
<h1 class="h1">Table Of Contents</h1>
<nav id="toc" epub:type="toc">
    <ol>
        <li class="table-of-content">
            <a href="toc.xhtml">- Table Of Contents -</a>
        </li>
        ${nav_contents} 
    </ol>
</nav>

</body>
</html>
`

// TITLE, AUTHOR, LANGUAGE, PUBLISHER, DATE_IOS_STRING, DATE_STRING, YEAR,
// IMAGE_0_ID, CONTENT_ITEMS, CONTENT_ITEMS_REFS
export const OEBPS_CONTENT_OPF = (
  title, author, language, publisher,
  date=new Date(),
  image0ID,
  content_items,
  content_items_refs,
) => `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf"
         version="3.0"
         unique-identifier="BookId"
         xmlns:dc="http://purl.org/dc/elements/1.1/"
         xmlns:dcterms="http://purl.org/dc/terms/"
         xml:lang="en"
         xmlns:media="http://www.idpf.org/epub/vocab/overlays/#"
         prefix="ibooks: http://vocabulary.itunes.apple.com/rdf/ibooks/vocabulary-extensions-1.0/">

    <metadata xmlns:dc="http://purl.org/dc/elements/1.1/"
              xmlns:opf="http://www.idpf.org/2007/opf">

        <dc:identifier id="BookId">1fc37579-81ab-4483-b1bc-3270f17f9afd</dc:identifier>
        <meta refines="#BookId" property="identifier-type" scheme="onix:codelist5">22</meta>
        <meta property="dcterms:identifier" id="meta-identifier">BookId</meta>
        <dc:title>${title}</dc:title>
        <meta property="dcterms:title" id="meta-title">${title}</meta>
        <dc:language>${language}</dc:language>
        <meta property="dcterms:language" id="meta-language">${language}</meta>
        <meta property="dcterms:modified">${date.toISOString()}</meta>
        <dc:creator id="creator">${author}</dc:creator>
        <meta refines="#creator" property="file-as">${author}</meta>
        <meta property="dcterms:publisher">${publisher}</meta>
        <dc:publisher>${publisher}</dc:publisher>
        
        <meta property="dcterms:date">${date.toISOString().slice(0, 10)}</meta>
        <dc:date>${date.toISOString().slice(0, 10)}</dc:date>
        <meta property="dcterms:rights">All rights reserved</meta>
        <dc:rights>Copyright &#x00A9; ${date.getFullYear()} by ${publisher}</dc:rights>
        <meta name="cover" content="image_cover"/>
        <meta name="generator" content="ct-epub-gen" />
        <meta property="ibooks:specified-fonts">true</meta>

    </metadata>

    <manifest>
        <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml" />
        <item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav"/>
        <item id="css" href="style.css" media-type="text/css" />
        <item id="image_cover" href="cover.jpeg" media-type="image/jpeg" />

        <item id="image_0" href="images/${image0ID}.jpeg" media-type="image/jpeg" />

        ${content_items}
        
    </manifest>

    <spine toc="ncx">   
        <itemref idref="toc" />

        ${content_items_refs}

    </spine>
    <guide>
        <reference type="text" title="Table of Content" href="toc.xhtml"/>
    </guide>
</package>
`


export const OEBPS_CONTENT_XHTML = (title, text, imageId, language) => `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${language}">
  <head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <link rel="stylesheet" type="text/css" href="style.css" />
  </head>
  <body>
    <h1>${title}</h1>
    <img src="images/${imageId}.jpeg" alt="image-placeholder"/>
    ${text}
  </body>
</html>
`