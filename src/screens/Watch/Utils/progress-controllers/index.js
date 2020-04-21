import { isFirefox } from 'react-device-detect'

import { chromeProgressCtrller } from './prog.chrome-safari'
import { fireFoxProgressCtrller } from './prog.firefox'

// determine which controller to use
export const prog = isFirefox 
                  ? fireFoxProgressCtrller
                  : chromeProgressCtrller 