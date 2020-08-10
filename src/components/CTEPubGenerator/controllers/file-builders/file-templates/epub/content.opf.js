import { dedent } from 'dentist';

export default ({
  title = '',
  author = '',
  language = '',
  publisher = '',
  date = new Date(),
  imageItems = '',
  contentItems = '',
  contentItemsRefs = '',
}) =>
  dedent(`
<?xml version="1.0" encoding="UTF-8"?>
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
        <item id="style" href="style.css" media-type="text/css" />
        <item id="katex" href="katex.min.css" media-type="text/css" />
        <item id="prism" href="prism.css" media-type="text/css" />

        <item id="image_cover" href="cover.jpeg" media-type="image/jpeg" />
        ${imageItems}

        ${contentItems}
        
    </manifest>

    <spine toc="ncx">   
        <itemref idref="toc" />

        ${contentItemsRefs}

    </spine>
    <guide>
        <reference type="text" title="Table of Content" href="toc.xhtml"/>
    </guide>
</package>
`);
