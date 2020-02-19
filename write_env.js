require('dotenv').config();
var fs = require('fs');
var json = process.env
var str = "window.env={}\n"
Object.keys(json)
    // Adding only environment variables startin with "REACT_APP_"
    .filter(word => word.startsWith('REACT_APP_'))
    .forEach(key => {
    str += ("window.env." + key.substring(10) + "=\"" + json[key] + "\"\n")
});
console.log(str);
fs.writeFile(process.argv[2], str, 'utf8', function (err) {
    if (err) throw err;
    console.log('complete');
});