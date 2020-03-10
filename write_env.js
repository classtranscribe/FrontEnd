require('dotenv').config();
var fs = require('fs');
var json = process.env
var str = "window.env={}\n"
var prefixes = ['REACT_APP_', 'AUTH0_']

for (i = 0; i < prefixes.length; i++) { 
    console.log(prefixes[i]);
    Object.keys(json)
        // Adding only environment variables startin with "REACT_APP_"
        .filter(word => word.startsWith(prefixes[i]))
        .forEach(key => {
        str += ("window.env." + key + "=\"" + json[key] + "\"\n")
    });
  }


console.log(str);
fs.writeFile(process.argv[2], str, 'utf8', function (err) {
    if (err) throw err;
    console.log('complete');
});