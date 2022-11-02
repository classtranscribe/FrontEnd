import { CTUserGuide, uurl } from 'utils';
import Constants from './constants/EPubConstants';
import { epubPref } from './PreferenceController';

const guides = [
  {
    intro: false,
    element: '#ct-epb-view-dropdown-btn',
    header: '1/3. Editing Options',
    description:
      'You can choose different editing options – editing chapter structures or content – using this dropdown button.',
  },
  {
    element: '#ct-epb-h-toolbth-keyboard',
    header: '2/3. Keyboard Shortcuts',
    description:
      'There are many keyboard shortcuts for you to quickly manage your I-Note file, click the "keyboard" icon button to explore!',
  },
  {
    element: '#ct-epb-download-dropdown',
    header: '3/3. Download Options',
    description: 'You can download your I-Note book in many formats, such as .epub, .pdf or HTML scripts.',
  },
];

const isEPubOnBoarded = async () => {
  const { from } = uurl.useHash();
  const isNewCreated = from === Constants.HFromNew;
  const isOnboard = epubPref.isUserOnboard;
  if (!isOnboard && isNewCreated) {
    epubPref.userOnboard();
    // console.log('epubPref.userOnboard();')
  }

  return isOnboard || !isNewCreated;
};

export const generateEPubGuide = (always = false) => {
  return new CTUserGuide(
    guides,
    always ? null : isEPubOnBoarded
  );
};
