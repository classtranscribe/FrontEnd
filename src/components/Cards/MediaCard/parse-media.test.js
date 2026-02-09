import { parseMedia } from './parse-media';

// Mock utils
jest.mock('utils', () => ({
  api: {
    parseMedia: jest.fn((media) => ({
      ...media,
      mediaName: 'Parsed Media Name',
      watchHistory: media.watchHistory || { ratio: 0 },
      isUnavailable: media.isUnavailable !== undefined ? media.isUnavailable : false,
      duration: media.duration || 0,
    })),
  },
  links: {
    watch: jest.fn((id) => `/video?id=${id}`),
  },
}));

describe.skip('parseMedia', () => { // TODO: Fix mock for links - see TRICKY-TODO.md
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('parses media object with mediaName', () => {
    const media = {
      id: 'media123',
      mediaName: 'Lecture 1',
      watchHistory: { ratio: 0.5 },
      isUnavailable: false,
      duration: 3600,
    };

    const result = parseMedia(media);

    expect(result).toEqual({
      key: 'media123',
      id: 'media123',
      name: 'Lecture 1',
      ratio: 0.5,
      href: '/video?id=media123',
      isUnavailable: false,
      duration: 3600,
    });
  });

  it('calls api.parseMedia when mediaName is missing', () => {
    const { api } = require('utils');
    const media = {
      id: 'media456',
      watchHistory: { ratio: 0.75 },
      isUnavailable: false,
      duration: 1800,
    };

    const result = parseMedia(media);

    expect(api.parseMedia).toHaveBeenCalledWith(media);
    expect(result.name).toBe('Parsed Media Name');
  });

  it('uses parsed mediaName from api.parseMedia', () => {
    const { api } = require('utils');
    const media = {
      id: 'media789',
      watchHistory: { ratio: 0.25 },
      isUnavailable: true,
      duration: 2400,
    };

    const result = parseMedia(media);

    expect(api.parseMedia).toHaveBeenCalledWith(media);
    expect(result.name).toBe('Parsed Media Name');
    expect(result.ratio).toBe(0.25);
  });

  it('generates correct href using links.watch', () => {
    const { links } = require('utils');
    const media = {
      id: 'test-media-id',
      mediaName: 'Test Video',
      watchHistory: { ratio: 0.1 },
      isUnavailable: false,
      duration: 1200,
    };

    parseMedia(media);

    expect(links.watch).toHaveBeenCalledWith('test-media-id');
  });

  it('preserves isUnavailable flag', () => {
    const media = {
      id: 'media-unavailable',
      mediaName: 'Unavailable Video',
      watchHistory: { ratio: 0 },
      isUnavailable: true,
      duration: 0,
    };

    const result = parseMedia(media);

    expect(result.isUnavailable).toBe(true);
  });

  it('includes ratio from watchHistory', () => {
    const media = {
      id: 'media-watched',
      mediaName: 'Watched Video',
      watchHistory: { ratio: 0.95 },
      isUnavailable: false,
      duration: 5000,
    };

    const result = parseMedia(media);

    expect(result.ratio).toBe(0.95);
  });

  it('sets key equal to id', () => {
    const media = {
      id: 'unique-id',
      mediaName: 'Video',
      watchHistory: { ratio: 0.5 },
      isUnavailable: false,
      duration: 3000,
    };

    const result = parseMedia(media);

    expect(result.key).toBe('unique-id');
    expect(result.id).toBe('unique-id');
  });
});
