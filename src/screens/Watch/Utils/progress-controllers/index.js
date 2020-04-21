import { isFirefox } from 'react-device-detect'

import { ChromeProgressController } from './prog.chrome-safari'
import { FireFoxProgressController } from './prog.firefox'

// determine which controller to use
const ProgressController = isFirefox 
                          ? FireFoxProgressController
                          : ChromeProgressController 

export const prog = new ProgressController()