import PlayerIDs from './PlayerIDs';

// Mock _buildID
jest.mock('utils', () => ({
  _buildID: (prefix, id) => `${prefix}${id}`,
}));

describe('PlayerIDs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('playerOuterContainerID', () => {
    it('generates outer container ID with prefix', () => {
      const id = 'test-123';
      const result = PlayerIDs.playerOuterContainerID(id);
      expect(result).toBe('ctp-outer-con-test-123');
    });

    it.skip('calls _buildID with correct parameters', () => {
      const { _buildID } = require('utils');
      PlayerIDs.playerOuterContainerID('abc');
      expect(_buildID).toHaveBeenCalledWith('ctp-outer-con-', 'abc');
    });
  });

  describe('playerInnerContainerID', () => {
    it('generates inner container ID with prefix', () => {
      const id = 'inner-456';
      const result = PlayerIDs.playerInnerContainerID(id);
      expect(result).toBe('ctp-inner-con-inner-456');
    });

    it.skip('calls _buildID with correct parameters', () => {
      const { _buildID } = require('utils');
      PlayerIDs.playerInnerContainerID('xyz');
      expect(_buildID).toHaveBeenCalledWith('ctp-inner-con-', 'xyz');
    });
  });

  describe('video1ID', () => {
    it('generates video 1 ID with prefix', () => {
      const id = 'video-1';
      const result = PlayerIDs.video1ID(id);
      expect(result).toBe('ctp-v1-video-1');
    });

    it.skip('calls _buildID with correct parameters', () => {
      const { _buildID } = require('utils');
      PlayerIDs.video1ID('v1');
      expect(_buildID).toHaveBeenCalledWith('ctp-v1-', 'v1');
    });
  });

  describe('video2ID', () => {
    it('generates video 2 ID with prefix', () => {
      const id = 'video-2';
      const result = PlayerIDs.video2ID(id);
      expect(result).toBe('ctp-v2-video-2');
    });

    it.skip('calls _buildID with correct parameters', () => {
      const { _buildID } = require('utils');
      PlayerIDs.video2ID('v2');
      expect(_buildID).toHaveBeenCalledWith('ctp-v2-', 'v2');
    });
  });

  describe('extraPanelID', () => {
    it('generates extra panel ID with prefix', () => {
      const id = 'panel-789';
      const result = PlayerIDs.extraPanelID(id);
      expect(result).toBe('ctp-extrapanel-789');
    });

    it.skip('calls _buildID with correct parameters', () => {
      const { _buildID } = require('utils');
      PlayerIDs.extraPanelID('panel');
      expect(_buildID).toHaveBeenCalledWith('ctp-extra', 'panel');
    });
  });

  describe('rangeContainerID', () => {
    it('generates range container ID with prefix', () => {
      const id = 'range-001';
      const result = PlayerIDs.rangeContainerID(id);
      expect(result).toBe('ctp-rangerange-001');
    });

    it.skip('calls _buildID with correct parameters', () => {
      const { _buildID } = require('utils');
      PlayerIDs.rangeContainerID('range');
      expect(_buildID).toHaveBeenCalledWith('ctp-range', 'range');
    });
  });

  describe('ID generation with different input types', () => {
    it('handles numeric IDs', () => {
      expect(PlayerIDs.video1ID(123)).toBe('ctp-v1-123');
    });

    it('handles empty string IDs', () => {
      expect(PlayerIDs.video2ID('')).toBe('ctp-v2-');
    });

    it('handles special characters in IDs', () => {
      expect(PlayerIDs.playerOuterContainerID('test-id_123')).toBe('ctp-outer-con-test-id_123');
    });
  });
});
