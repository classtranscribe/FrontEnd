const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios')
const { program } = require('commander');
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  format: format.combine(
    format.splat(),
    format.simple()
  ),
  transports: [new transports.Console()]
});

let backendList = {
  production : "https://classtranscribe.illinois.edu",
  dev  : "https://ct-dev.ncsa.illinois.edu"
}

/**
 * adds REACT_APP_TESTING_BASE_URL env var to the config file
 *
 * @param {string} data    config.js file data
 * @param {string} url     url of qchosen backend
 */
function change(data, url) {
  let serverEnv;
  if (url === backendList.production)
    serverEnv = "window.env.REACT_APP_API_BASE_URL"
  if (url === backendList.dev)
    serverEnv = "window.env.REACT_APP_TESTING_BASE_URL"
    
  let env = `${serverEnv}="${url}"\n`
  return(data + env )
}

/**
 * fetches config file
 * @param {string} url     url of chosen backend
 */
async function fetchConfig(url) {
  let d = await axios.get(`${url}/config.js`)
                  .then(({data}) => data)
                  .catch(err => {})
  return d;
}

/**
 * saves data to "./public/config"
 * @param {string} data     url of chosen backend
 */
function saveToPublicDir(data, url) {
  try {
    fs.writeFileSync("./public/config.js", data)
    logger.log('info', chalk.green(`Backend : ${chalk.bold(url)}`))
  }
  catch(err) {
    logger.log('error', chalk.red.bold(err))
  }
}


/**
 * gets config data from url and adds new env var
 * before saving config file in /public dir
 * @param {string} url    url of chosen backend
 */
async function setBackend(url) {
  let data = await fetchConfig(url)
  
  if (!data) {
    logger.log('error', chalk.red(`Could not connect to server ${url} `))
    return
  }
  data = change(data, url);
  saveToPublicDir(data, url);
}


/**
 * gets config data from dev and sets backend to custom address
 * before saving config file in /public dir
 * @param {string} url    url of chosen backend
 */
async function setCustomBackend({localhost : url}) {
  if (!url.startsWith("http://localhost")) {
    logger.log('error', chalk.red(`The server address must be complete \ni.e. ${chalk.bold("https://localhost[...]")}`))
    return;
  }
  
  let data = await fetchConfig(backendList.dev)
  
  if (!data) {
    logger.log('error', chalk.red(`Could not connect to server ${backendList.dev} `))
    
    return
  }
  data = change(data, url);
  saveToPublicDir(data, url);
}

/**
 * processs command line arguments to select 
 * dev or production server
 */
function processArgs() {
  program
    .option('-p --production', `${backendList.production} (Currently not working)` )
    .option('-d --dev', backendList.dev)
    .option('-l --localhost <string>', "complete Localhost address")

  program.parse(process.argv);
  let backend = Object.keys(program.opts())
  
  if (backend.length !== 1) {
    logger.log('error', chalk.red(`Invalid args \nType : ${chalk.bold("yarn backend -h")}`))
    return
  }
  if (backend[0] === "localhost")
    setCustomBackend(program.opts())
  else 
    setBackend(backendList[backend[0]]);
}

/**
 * runs processArgs only if the file is called as an export
 */
if (require.main === module) {
    processArgs();
}

module.exports.setBackend = setBackend;

