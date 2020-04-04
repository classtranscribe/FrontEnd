import { cthttp } from './request'
import { env } from '../../env'

// get latest git commit of FrontEnd repo
export function getLatestGitCommitData() {
    return cthttp.get(env.frontendCommitEndpoint)
}

export async function getLatestGitCommitSHA() {
    let { data } = await getLatestGitCommitData()
    return data.sha
}

export function getFile(path) {
    return cthttp.request().get(path)
}