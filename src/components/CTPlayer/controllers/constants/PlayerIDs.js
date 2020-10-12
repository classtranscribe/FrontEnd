import { _buildID } from 'utils';

class PlayerIDs {
  static playerOuterContainerID(id) {
    return _buildID('ctp-outer-con-', id);
  }

  static playerInnerContainerID(id) {
    return _buildID('ctp-inner-con-', id);
  }

  static video1ID(id) {
    return _buildID('ctp-v1-', id);
  }

  static video2ID(id) {
    return _buildID('ctp-v2-', id);
  }

  static extraPanelID(id) {
    return _buildID('ctp-extra', id);
  }

  static rangeContainerID(id) {
    return _buildID('ctp-range', id);
  }
}

export default PlayerIDs;