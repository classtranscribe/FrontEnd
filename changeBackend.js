const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios');
// const https = require('https');
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
  dev  : "https://ct-dev.ncsa.illinois.edu",
  localhost : "https://localhost:8443/",
}

/**
 * adds REACT_APP_TESTING_BASE_URL env var to the config file.
 * If TestSignIn is true then the frontend will use 
 * REACT_APP_TESTING_BASE_URL for server calls
 *
 * @param {string} data    config.js file data
 * @param {string} url     url of qchosen backend
 */
function appendServer(data, url) {
  const testSignInConfig = data.split("\n").filter(line => line.includes("TEST_SIGN_IN"));
  const isTesting = testSignInConfig.length === 1 && testSignInConfig[0].includes("true");
  const serverEnv = `${data}\nwindow.env.REACT_APP_${ isTesting? "TESTING" : "API"}_BASE_URL="${url}"\n`
  return serverEnv;
}

/**
 * fetches config file
 * @param {string} url     url of chosen backend
 */
async function fetchConfig(url) {
  // TODO ignore self cert for localhost
  const isLocalhost = url.includes("://localhost");
  if(isLocalhost) {
    logger.log('info', chalk.greenBright(`Localhost API - self cert will be ignored. However you will still need to accept the self cert of the API endpoint in your browser for axios API calls to succeed.`));
    logger.log('info', chalk.greenBright(`If you are using Chrome, you can do this by going to the API endpoint in your browser and clicking "Advanced" and then "Proceed to localhost (unsafe)"`) );
    logger.log('info', chalk.greenBright(`Open ${ chalk.white(`${url}api/Universities`) }${chalk.green(" to accept the cert")}`));
    // see requiredEnvs in env.js
    return 'window.env={}\nwindow.env.TEST_SIGN_IN="true"\nwindow.env.AUTH0_DOMAIN="0"\nwindow.env.AUTH0_CLIENT_ID="0"\nwindow.env.CILOGON_CLIENT_ID="0"\n';
  }

//   const agent = new https.Agent({
//     rejectUnauthorized: !isLocalhost,
//     requestCert: !isLocalhost,
//     agent: !isLocalhost,
//  });
 const client = axios.create(); // { httpsAgent: agent }

  let d = await client.get(`${url}/config.js`,
  )
                  .then(({data}) => data)
                  // eslint-disable-next-line no-unused-vars
                  .catch(err => {logger.error(err);})
  return d;
}

/**
 * saves data to "./public/config"
 * @param {string} data     url of chosen backend
 */
function saveToPublicDir(data, url) {
  try {
    fs.writeFileSync("./public/config.js", data)
    logger.log('info', chalk.white(`Config file downloaded and written for new backend server <${chalk.bold(url)}>`))
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
// async function setBackend(url) {
//   let data = await fetchConfig(url)
  
//   if (!data) {
//     logger.log('error', chalk.red(`Could not connect to server ${url} `))
//     return
//   }
//   data = appendServer(data, url);
//   saveToPublicDir(data, url);
// }


/**
 * gets config data from dev and sets backend to custom address
 * before saving config file in /public dir
 * @param {string} url    url of chosen backend
 */
async function setBackend(url) {
  if (!url.startsWith("http")) {
    logger.log('error', chalk.red(`The full server address and protocol must be specified \ne.g., ${chalk.bold("https://localhost:8443/")}`))
    return;
  }
  
  let data = await fetchConfig(url)
  
  if (!data) {
    logger.log('error', chalk.red(`Could not connect to server <${url}> to download config file`))
    
    return
  }
  data = appendServer(data, url);
  saveToPublicDir(data, url);
}

/**
 * processs command line arguments to select 
 * dev or production server
 */
function processArgs() {
  program.arguments("[url]")
    .option('-p --production', `${backendList.production}` )
    .option('-d --dev', backendList.dev)
    .option('-l --localhost', `Local docker instance`);

  program.parse(process.argv);
  let backend = Object.keys(program.opts());
  let url = backendList[backend[0]] ?? program.args[0];
  
  if (! url) {
    logger.log('error', chalk.red('Invalid args'))
    program.help();
    return
  }
  
  logger.log('info',chalk.gray(`Connecting to <${url}> ...`));
  
  setBackend(url);
  if(! url.includes("://localhost") && ! url.includes("://ct-dev")) {
    logger.log('info', chalk.greenBright("Some production features are unavailable, including:"));
    logger.log('info', chalk.greenBright("* CILogin (Illinois) authentication is unavailable. However auth0 (email) authentication is available"));
    logger.log('info', chalk.greenBright("* Video playback is unavailable"));
  }
}

/**
 * runs processArgs only if the file is called as an export
 */
if (require.main === module) {
    processArgs();
}

module.exports.setBackend = setBackend;

