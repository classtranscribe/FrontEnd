import { _buildID } from 'utils';

const _buildEpbId = (prefix, id) => _buildID(prefix, id, '.');

/**
 * Identifiers for elements in the CTEPubGenerator
 */
export default class EPubIDs {
  // ID
  static EPubMainID = 'ct-epb-main';
  static EPubChapterListID = 'ct-epb-ch-list';
  static EPubPlayerModal = 'ct-epb-player-modal';

  static LaunchScreenContainerID = 'ct-epb-ls-con';

  static SplitChapterContainerID = 'ct-epb-sch-con';
  static SplitChapterMDPreviewerID = 'ct-epb-sch-md-pview-con';
  static SplitChapterItemCarouselID = 'ct-epb-sch-it-carousel';

  static EditChapterContainerID = 'ct-epb-ech-con';

  static DownloadEPubContainerID = 'ct-epb-download-con';

  // navigation
  static EPubNavigationMenuID = 'ct-epb-nav-menu';
  static EPubNavigationProviderID = 'ct-epb-nav-provider';

  // Prefix
  static ChapterIDPrefix = 'ch';
  static ChapterTitleIDPrefix = 'epb-ch-ti';
  static ChapterImageIDPrefix = 'epb-ch-img';
  static ChapterTextIDPrefix = 'epb-ch-txt';
  static ChapterNavItemIDPrefix = 'epb-nav-ch';

  static SubChapterIDPrefix = 'sch';
  static SubChapterTitleIDPrefix = 'epb-sch-ti';
  static SubChapterImageIDPrefix = 'epb-sch-img';
  static SubChapterTextIDPrefix = 'epb-sch-txt';
  static SubChapterNavItemIDPrefix = 'epb-nav-sch';

  static epbItemViewId(itemId) {
    return _buildEpbId('epb-item-view', itemId);
  }

  static chID(chId) {
    return _buildEpbId(EPubIDs.ChapterIDPrefix, chId);
  }

  static chTitleID(chId) {
    return _buildEpbId(EPubIDs.ChapterTitleIDPrefix, chId, );
  }

  static chImgID(chId) {
    return _buildEpbId(EPubIDs.ChapterImageIDPrefix, chId);
  }

  static chTextID(chId) {
    return _buildEpbId(EPubIDs.ChapterTextIDPrefix, chId);
  }

  static chNavItemID(chId) {
    return _buildEpbId(EPubIDs.ChapterNavItemIDPrefix, chId);
  }



  static schID(schId) {
    return _buildEpbId(EPubIDs.SubChapterIDPrefix, schId);
  }

  static schTitleID(schId) {
    return _buildEpbId(EPubIDs.SubChapterTitleIDPrefix, schId);
  }

  static schImgID(schId) {
    return _buildEpbId(EPubIDs.SubChapterImageIDPrefix, schId);
  }

  static schTextID(schId) {
    return _buildEpbId(EPubIDs.SubChapterTextIDPrefix, schId);
  }

  static schNavItemID(schId) {
    return _buildEpbId(EPubIDs.SubChapterNavItemIDPrefix, schId);
  }
}