import { buildID } from './utils';

export default class EPubIDs {
  // ID
  static EPubGeneratorContainerID = 'ct-epb-con';
  static EPubChapterListID = 'ct-epb-ch-list';
  static EPubChapterNavListID = 'ct-epb-nav-list';
  static SplitChapterContainerID = 'ct-epb-sch-con';
  static SplitChapterMDPreviewerID = 'ct-epb-sch-md-pview-con';

  // Prefix
  static ChapterIDPrefix = 'epb-ch';
  static ChapterTitleIDPrefix = 'epb-ti-ch';
  static ChapterTextIDPrefix = 'epb-txt-ch';
  static ChapterNavItemIDPrefix = 'epb-nav-ch';

  static SubChapterIDPrefix = 'epb-sub-ch';
  static SubChapterTitleIDPrefix = 'epb-ti-sch';
  static SubChapterTextIDPrefix = 'epb-txt-sch';
  static SubChapterNavItemIDPrefix = 'epb-nav-sch';

  static chID(chId) {
    return buildID(EPubIDs.ChapterIDPrefix, chId);
  }

  static chTitleID(chId) {
    return buildID(EPubIDs.ChapterTitleIDPrefix, chId);
  }

  static chTextID(chId) {
    return buildID(EPubIDs.ChapterTextIDPrefix, chId);
  }

  static chNavItemID(chId) {
    return buildID(EPubIDs.ChapterNavItemIDPrefix, chId);
  }

  static schID(schId) {
    return buildID(EPubIDs.SubChapterIDPrefix, schId);
  }

  static schTitleID(schId) {
    return buildID(EPubIDs.SubChapterTitleIDPrefix, schId);
  }

  static schTextID(schId) {
    return buildID(EPubIDs.SubChapterTextIDPrefix, schId);
  }

  static schNavItemID(schId) {
    return buildID(EPubIDs.SubChapterNavItemIDPrefix, schId);
  }
}