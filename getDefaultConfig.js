const fs = require('fs');
const chalk = require('chalk');
const {setBackend} = require("./changeBackend");




let url = "https://classtranscribe-dev.ncsa.illinois.edu"

try {
  if (!fs.existsSync("./public/config.js")) {
    setBackend(url)
    return;
  }
} 
catch(err) {
  console.log(chalk.red(err))
}


