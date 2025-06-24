import { allCourseThunks } from "screens/Course/courseSlice";
import { allHomeThunks } from "screens/Home/homeSlice";
import { allInstPlaylistThunks } from "screens/Instructor/InstPlaylist/instPlaylistSlice";
import { allPlayerPrefThunks } from "screens/Watch/playerPrefSlice";
import { allWatchThunks } from "screens/Watch/watchSlice";
import { allEffectThunks } from "screens/Watch/model/index";
import { allEPubThunks } from "screens/EPub/epubSlice";
import { allNavigatorThunks } from "screens/EPub/models/navigatorThunks";
import { allMediaSettingThunks } from "screens/MediaSettings/mediaSettingSlice";

// this is only for legacy async thunks to maintain compatibility with
// 'dispatch({type:"slice/action"})'. In the future, new thunks
// should only be called by 'dispatch(action(payload))', so you do not need
// to register them here
export const allThunks = {
  ...allCourseThunks,
  ...allHomeThunks,
  ...allInstPlaylistThunks,
  ...allPlayerPrefThunks,
  ...allWatchThunks,
  ...allEffectThunks,
  ...allNavigatorThunks,
  ...allEPubThunks,
  ...allMediaSettingThunks
}