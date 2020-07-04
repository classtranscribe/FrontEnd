import { SetupCoursePage } from '../../CourseSettings/controllers/setup';

export { courseStore, connectWithRedux } from 'redux/course';

export const setup = new SetupCoursePage('New Playlist');
export { plControl } from './playlist.control';