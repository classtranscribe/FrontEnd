const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios')
const { program } = require('commander');


backendList = {
  production : "https://classtranscribe.illinois.edu",
  dev  : "https://classtranscribe-dev.ncsa.illinois.edu"
}


/**
 * adds REACT_APP_TESTING_BASE_URL env var to the config file
 *
 * @param {string} data    config.js file data
 * @param {string} url     url of chosen backend
 */
function change(data, url) {
    let serverEnv = "window.env.REACT_APP_TESTING_BASE_URL"
    let env = `${serverEnv}="${url}"\n`
    return(data + env )
}

/**
 * gets config data from url and adds new env var
 * before saving config file in /public dir
 *
 * @param {string} url    url of chosen backend
 */
async function setBackend(url) {
  let data = await axios.get(`${backendList["dev"]}/config.js`)
                  .then(({data}) => data)
                  .catch(err => {})
  if (!data) {
    console.log(chalk.red.bold(`Could not connect to server ${url}`))
    return
  }
  data = change(data, url);
    
  try {
    fs.writeFileSync("./public/config.js", data)
    console.log(chalk.green(`Backend : ${chalk.bold(url)}`))
  }
  catch(err) {
    console.log(chalk.red.bold(err))
  }
}

/**
 * processs command line arguments to select 
 * dev or production server
 */
function processArgs() {
  program
    .option('-p --production', backendList.production )
    .option('-d --dev', backendList.dev)

  program.parse(process.argv);
  let backend =  Object.keys(program.opts())

  if (backend.length !== 1) {
    console.log(chalk.red(`Invalid args \nType : ${chalk.bold("yarn backend -h")}`))
    return
  }
  setBackend(backendList[backend[0]]);
}

/**
 * runs processArgs only if the file is called as an export
 */
if (require.main === module) {
    processArgs();
}


module.exports.setBackend = setBackend;

