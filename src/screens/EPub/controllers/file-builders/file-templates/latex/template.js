export default({
    title = '',
    content = '',
    author = ''
}) => `
\\documentclass[11pt]{article}
\\usepackage{amsmath, graphicx}
\\title{${title}}
\\author{${author}}
\\begin{document}
\\maketitle
\\newpage
${content}
\\end{document}
`;