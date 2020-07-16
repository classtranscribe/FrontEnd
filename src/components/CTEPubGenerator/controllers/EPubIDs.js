import { buildID } from './utils';

export default class EPubIDs {
  // ID
  static EPubGeneratorContainerID = 'ct-epb-con';
  static SplitChapterContainerID = 'ct-epb-sch-con';
  static SplitChapterChapterListID = 'ct-epb-sch-ch-list';
  static SplitChapterMDPreviewerID = 'ct-epb-sch-md-pview-con';

  // Prefix
  static ChapterIDPrefix = 'epb-ch';
  static SubChapterIDPrefix = 'epb-sub-ch';
  static ChapterTitleIDPrefix = 'epb-t-ch';
  static SubChapterTitleIDPrefix = 'epb-t-sch';
  static ChapterNavItemIDPrefix = 'epb-nav-ch';
  static SubChapterNavItemIDPrefix = 'epb-nav-sch';

  static chID(chId) {
    return buildID(EPubIDs.ChapterIDPrefix, chId);
  }

  static schID(schId) {
    return buildID(EPubIDs.SubChapterIDPrefix, schId);
  }

  static chTitleID(chId) {
    return buildID(EPubIDs.ChapterTitleIDPrefix, chId);
  }

  static schTitleID(schId) {
    return buildID(EPubIDs.SubChapterTitleIDPrefix, schId);
  }

  static chNavItemID(chId) {
    return buildID(EPubIDs.ChapterNavItemIDPrefix, chId);
  }

  static schNavItemID(schId) {
    return buildID(EPubIDs.SubChapterNavItemIDPrefix, schId);
  }
}