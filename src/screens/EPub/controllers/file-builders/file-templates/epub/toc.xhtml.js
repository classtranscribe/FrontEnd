import { dedent } from 'dentist';

export default ({
  title = '',
  language = '',
  navContents = ''
}) =>
  dedent(`
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${language}" lang="${language}">
<head>
    <title>${title}</title>
    <meta charset="UTF-8" />
    <link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
<h1>${title}</h1>
<h2 class="h1">Table Of Contents</h2>
<nav id="toc" epub:type="toc">
    <dl>
        <dt class="table-of-content">
            <a href="toc.xhtml">- Table Of Contents -</a>
        </dt>
        ${navContents} 
    </dl>
</nav>

</body>
</html>
`);
