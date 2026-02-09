
const registerHighlightLanguages = () => {
//  require('prismjs/components/prism-jsx.min');
//  require('prismjs/components/prism-python.min');
require('prismjs');
const loadLanguages = require('prismjs/components/');
loadLanguages(['python', 'jsx', 'js']);
};

export default registerHighlightLanguages;