import { isFirefox, isMobile } from 'react-device-detect';

import { ChromeProgressController } from './prog.chrome-safari';
import { FireFoxProgressController } from './prog.firefox';
import { MobileProgressController } from './prog.mobile';

// determine which controller to use
const ProgressController = isMobile
  ? MobileProgressController
  : isFirefox
  ? FireFoxProgressController
  : ChromeProgressController;

export const prog = new ProgressController();
