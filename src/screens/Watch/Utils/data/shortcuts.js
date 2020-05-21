export const shortcuts = [
  {
    name: 'playback',
    rows: [
      {
        keys: [{ key1: 'Space' }, { key1: 'k' }],
        action: 'Toggle play/pause',
      },
      {
        keys: [{ key1: '←' }, { key1: 'j' }],
        action: 'Rewind 10 seconds',
      },
      {
        keys: [{ key1: '→' }, { key1: 'l' }],
        action: 'Fast forward 10 seconds',
      },
      {
        keys: [{ key1: '0...9' }],
        action: 'Seek to 0% - 90% of the duration of the video',
      },
      {
        keys: [{ key1: '⇧ Shift', key2: '↑' }],
        action: 'Increase playback rate by 0.25 (maximum rate is 4)',
      },
      {
        keys: [{ key1: '⇧ Shift', key2: '↓' }],
        action: 'Decrease playback rate by 0.25 (minimum rate is 0.25)',
      },
    ],
  },

  {
    name: 'general',
    rows: [
      {
        keys: [{ key1: '↑' }],
        action: 'Increase volume by 5 (out of 100)',
      },
      {
        keys: [{ key1: '↓' }],
        action: 'Decrease volume by 5 (out of 100)',
      },
      {
        keys: [{ key1: 'm' }],
        action: 'Toggle mute/unmute',
      },
      {
        keys: [{ key1: 'f' }],
        action: 'Enter/exit full screen',
      },
      {
        keys: [{ key1: '⇧ Shift', key2: ',' }],
        action: 'Switch screens (if there are 2 screens)',
      },
    ],
  },

  {
    name: 'Caption and Transcription',
    rows: [
      {
        keys: [{ key1: 'c' }],
        action: 'Toggle closed caption ON/OFF',
      },
      {
        keys: [{ key1: 'd' }],
        action: 'Toggle audio description ON/OFF',
      },
      {
        keys: [{ key1: '⇧ Shift', key2: '=' }],
        action: 'Increase font size of closed caption/audio description',
      },
      {
        keys: [{ key1: '⇧ Shift', key2: '-' }],
        action: 'Decrease font size of closed caption/audio description',
      },
      {
        keys: [{ key1: '⎇ Alt', key2: 'e' }],
        action: 'Edit the caption at current time',
      },
      {
        keys: [{ key1: '⇧ Shift', key2: '/' }],
        action: 'Search for captions and videos',
      },
    ],
  },

  {
    name: 'menu',
    rows: [
      {
        keys: [{ key1: '⇧ Shift', key2: 'q' }],
        action: 'Close Menu (if any)',
      },
      {
        keys: [{ key1: '⎇ Alt', key2: '/' }],
        action: 'Shortcuts',
      },
      {
        keys: [{ key1: '⇧ Shift', key2: 'c' }],
        action: 'Settings',
      },
      {
        keys: [{ key1: '⇧ Shift', key2: 'p' }],
        action: 'Playlists menu',
      },
      {
        keys: [{ key1: '⇧ Shift', key2: 'r' }],
        action: 'Playback rate menu',
      },
      {
        keys: [{ key1: '⇧ Shift', key2: 's' }],
        action: 'Screen mode menu',
      },
      {
        keys: [{ key1: '⇧ Shift', key2: 'd' }],
        action: 'Download menu',
      },
    ],
  },
];
