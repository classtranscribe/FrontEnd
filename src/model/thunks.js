import { allCourseThunks } from "screens/Course/courseSlice";
import { allHomeThunks } from "screens/Home/homeSlice";
import { allInstPlaylistThunks } from "screens/Instructor/InstPlaylist/instPlaylistSlice";
import { allPlayerPrefThunks } from "screens/Watch/playerPrefSlice";
import { allWatchThunks } from "screens/Watch/watchSlice";

// this is only for legacy async thunks to maintain compatibility with
// dispatch({type:"slice/action"}). In the future, if new thunks
// are only called by dispatch(action(payload)), you do not need
// to register them here
export const allThunks = {
  ...allCourseThunks,
  ...allHomeThunks,
  ...allInstPlaylistThunks,
  ...allPlayerPrefThunks,
  ...allWatchThunks
}