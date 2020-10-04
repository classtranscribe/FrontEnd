import * as statics from './statics';
import * as generalRequests from './general-requests';
import * as responseErrors from './responses/errors';
import * as responseParsers from './responses/parsers';
import * as userMetadata from './userMetadata';

import * as Account from './entities/Account';
import * as Captions from './entities/Captions';
import * as Courses from './entities/Courses';
import * as Departments from './entities/Departments';
import * as EPubs from './entities/EPubs';
import * as Images from './entities/Images';
import * as Logs from './entities/Logs';
import * as Media from './entities/Media';
import * as Offerings from './entities/Offerings';
import * as Playlists from './entities/Playlists';
import * as Roles from './entities/Roles';
import * as Terms from './entities/Terms';
import * as Universities from './entities/Universities';
import * as WatchHistories from './entities/WatchHistories';

/**
 * HTTP request tool for ClassTranscribe
 */
export const api = {
    ...statics,
    ...generalRequests,
    ...userMetadata,
    ...responseErrors,
    ...responseParsers,

    ...Account,
    ...Captions,
    ...Courses,
    ...Departments,
    ...EPubs,
    ...Images,
    ...Logs,
    ...Media,
    ...Offerings,
    ...Playlists,
    ...Roles,
    ...Terms,
    ...Universities,
    ...WatchHistories,   
};
