// import { isMobile } from 'react-device-detect'
import { /* user, */ CTUserGuide } from 'utils';

const guides = [
  // {
  //     intro: true,
  //     header: 'Start watching your first video',
  //     description: 'Get to know the helpful tools',
  //     imgURL: logoOutline
  // },
  {
    intro: false,
    element: '#wp-h-search-btn',
    header: 'Search in this video',
    description:
      'Find captions, video names, and shortcuts here. You can also search the captions across an entire course.',
  },
  {
    element: '#menu-transcription',
    header: 'Audio Descriptions and Captions in other languages',
    description:
      'We support multiple transcriptions. Select your native language here!',
  },
  {
    element: '#watch-share-btn',
    header: 'Share this video moment with your class',
    description: 'You can get a shareable link of this video here.',
  },
  {
    element: '#menu-glossary',
    header: 'Find out more in the glossary',
    description: 'Review meanings and learn ASL.',
  },
  {
    element: '#menu-shortcuts',
    header: 'Shortcuts for the win!',
    description: 'Save time by learning shortcuts here.',
  },
  

]; 

async function isWatchPageOnBoarded() {
  // // only display user guide for logged-in users
  // if (!user.isLoggedIn || isMobile) {
  //     return true
  // }

  return false;
}

export const generateWatchUserGuide = () => {
  return new CTUserGuide(
    guides,
    isWatchPageOnBoarded,
    { mode: 'dark' }, // switch mode into dark
  );
};
