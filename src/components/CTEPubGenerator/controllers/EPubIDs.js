import { buildID } from './utils';


/**
 * Identifiers for elements in the CTEPubGenerator
 */
export default class EPubIDs {
  // ID
  static EPubGeneratorContainerID = 'ct-epb-con';
  static EPubNavigatorContainerID = 'ct-epb-nav-con';
  static EPubChapterListID = 'ct-epb-ch-list';
  static EPubChapterNavListID = 'ct-epb-nav-list';
  static EPubPlayerModal = 'ct-epb-player-modal';

  static LaunchScreenContainerID = 'ct-epb-ls-con';

  static SplitChapterContainerID = 'ct-epb-sch-con';
  static SplitChapterMDPreviewerID = 'ct-epb-sch-md-pview-con';
  static SplitChapterItemCarouselID = 'ct-epb-sch-it-carousel';

  static EditChapterContainerID = 'ct-epb-ech-con';

  static DownloadEPubContainerID = 'ct-epb-download-con';

  // Prefix
  static ChapterIDPrefix = 'epb-ch';
  static ChapterTitleIDPrefix = 'epb-ch-ti';
  static ChapterImageIDPrefix = 'epb-ch-img';
  static ChapterTextIDPrefix = 'epb-ch-txt';
  static ChapterNavItemIDPrefix = 'epb-nav-ch';

  static SubChapterIDPrefix = 'epb-sch';
  static SubChapterTitleIDPrefix = 'epb-sch-ti';
  static SubChapterImageIDPrefix = 'epb-sch-img';
  static SubChapterTextIDPrefix = 'epb-sch-txt';
  static SubChapterNavItemIDPrefix = 'epb-nav-sch';

  static chID(chId) {
    return buildID(EPubIDs.ChapterIDPrefix, chId);
  }

  static chTitleID(chId) {
    return buildID(EPubIDs.ChapterTitleIDPrefix, chId);
  }

  static chImgID(chId) {
    return buildID(EPubIDs.ChapterImageIDPrefix, chId);
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

  static schImgID(schId) {
    return buildID(EPubIDs.SubChapterImageIDPrefix, schId);
  }

  static schTextID(schId) {
    return buildID(EPubIDs.SubChapterTextIDPrefix, schId);
  }

  static schNavItemID(schId) {
    return buildID(EPubIDs.SubChapterNavItemIDPrefix, schId);
  }
}