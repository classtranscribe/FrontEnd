import {
    api,
    user,
    elem,
    prompt,
    ARRAY_INIT,
    STUDENT,
    INSTRUCTOR
} from 'utils';

export default {
    isInstructor(role) {
        return role === INSTRUCTOR;
    },
    scrollToPlaylist(playlistId) {
        if (playlistId) {
            elem.scrollIntoCenter(playlistId, { focus: true });
        }
    }
}