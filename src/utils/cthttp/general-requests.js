import axios from 'axios';
import { cthttp } from './request';
import { env } from '../env';

// get latest git commit of FrontEnd repo
function getLatestGitCommitData() {
  return cthttp.request(false).get(env.frontendCommitEndpoint);
}

export async function getLatestGitCommitSHA() {
  const { data } = await getLatestGitCommitData();
  return data.sha;
}

export function getFile(path) {
  return cthttp.request(false).get(path);
}

/**
 * load src buffer
 * @param {String} path path to the src
 * @returns {Promise<Buffer>} the loaded src buffer
 */
export async function getBuffer(path) {
  // Adding authorization token
  const { data } = await cthttp.request().get(path, { responseType: 'arraybuffer' }); 
  return Buffer.from(data);
}
