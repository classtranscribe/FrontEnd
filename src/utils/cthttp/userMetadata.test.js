import { storeUserMetadata } from './userMetadata';
import { getUserMetaData, postUserMetaData } from './entities/Account';

jest.mock('./entities/Account', () => ({
  getUserMetaData: jest.fn(),
  postUserMetaData: jest.fn(),
}));

describe('userMetadata', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('storeUserMetadata', () => {
    it('loads starred offerings from user metadata', async () => {
      const mockStarredOfferings = { off1: true, off2: true };
      getUserMetaData.mockResolvedValue({
        data: {
          starredOfferings: JSON.stringify(mockStarredOfferings)
        }
      });

      const setStarredOfferings = jest.fn();
      const setStarredOfferingsArray = jest.fn();

      await storeUserMetadata({ setStarredOfferings, setStarredOfferingsArray });

      expect(getUserMetaData).toHaveBeenCalled();
      expect(setStarredOfferings).toHaveBeenCalledWith(mockStarredOfferings);
      expect(setStarredOfferingsArray).toHaveBeenCalledWith(['off1', 'off2']);
    });

    it('handles metadata.starredOfferings format', async () => {
      const mockStarredOfferings = { off1: true, off2: true };
      getUserMetaData.mockResolvedValue({
        data: {
          metadata: {
            starredOfferings: JSON.stringify(mockStarredOfferings)
          }
        }
      });

      const setStarredOfferings = jest.fn();

      await storeUserMetadata({ setStarredOfferings });

      expect(postUserMetaData).toHaveBeenCalledWith({
        starredOfferings: JSON.stringify(mockStarredOfferings)
      });
      expect(setStarredOfferings).toHaveBeenCalledWith(mockStarredOfferings);
    });

    it('sets empty object when no starred offerings exist', async () => {
      getUserMetaData.mockResolvedValue({
        data: {}
      });

      const setStarredOfferings = jest.fn();
      const setStarredOfferingsArray = jest.fn();

      await storeUserMetadata({ setStarredOfferings, setStarredOfferingsArray });

      expect(setStarredOfferings).toHaveBeenCalledWith({});
      expect(setStarredOfferingsArray).toHaveBeenCalledWith([]);
    });

    it('handles errors by setting empty values', async () => {
      getUserMetaData.mockRejectedValue(new Error('Network error'));

      const setStarredOfferings = jest.fn();
      const setStarredOfferingsArray = jest.fn();

      await storeUserMetadata({ setStarredOfferings, setStarredOfferingsArray });

      expect(consoleErrorSpy).toHaveBeenCalledWith("Couldn't load user metadata.");
      expect(setStarredOfferings).toHaveBeenCalledWith({});
      expect(setStarredOfferingsArray).toHaveBeenCalledWith([]);
    });

    it('only sets values when setter functions are provided', async () => {
      getUserMetaData.mockResolvedValue({
        data: {
          starredOfferings: JSON.stringify({ off1: true })
        }
      });

      // Call without any setters
      await storeUserMetadata({});

      // Should not throw and complete successfully
      expect(getUserMetaData).toHaveBeenCalled();
    });

    it('only sets starredOfferingsArray when setter is provided', async () => {
      getUserMetaData.mockResolvedValue({
        data: {
          starredOfferings: JSON.stringify({ off1: true })
        }
      });

      const setStarredOfferings = jest.fn();

      await storeUserMetadata({ setStarredOfferings });

      expect(setStarredOfferings).toHaveBeenCalledWith({ off1: true });
    });
  });
});
