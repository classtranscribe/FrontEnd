import * as statics from './statics'

import * as general from './requests/general'

import * as account from './requests/account'
import * as roles from './requests/roles'
import * as logs from './requests/logs'

import * as universities from './requests/universities'
import * as departments from './requests/departments'
import * as terms from './requests/terms'
import * as courses from './requests/courses'
import * as offerings from './requests/offerings'
import * as playlists from './requests/playlists'
import * as medias from './requests/medias'
import * as captions from './requests/captions'
import * as epub from './requests/epub'

import * as responseErrors from './responses/errors'
import * as responseParsers from './responses/parsers'

import * as userMetadata from './userMetadata'

/**
 * HTTP request tool for ClassTranscribe
 */
export const api = {
    ...statics,

    ...general,
    ...account,
    ...roles,
    ...logs,
    ...universities,
    ...departments,
    ...terms,
    ...courses,
    ...offerings,
    ...playlists,
    ...medias,
    ...captions,
    ...epub,

    ...responseErrors,
    ...responseParsers,

    ...userMetadata
}
