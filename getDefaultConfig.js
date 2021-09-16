const fs = require('fs');
const chalk = require('chalk');
const { createLogger, format, transports } = require('winston');
const {setBackend} = require("./changeBackend");

const logger = createLogger({
  format: format.combine(
    format.splat(),
    format.simple()
  ),
  transports: [new transports.Console()]
});

let url = "https://ct-dev.ncsa.illinois.edu"

try {
  if (!fs.existsSync("./public/config.js")) {
    setBackend(url)
    return;
  }
} 
catch(err) {
  logger.log('error', err)
}


