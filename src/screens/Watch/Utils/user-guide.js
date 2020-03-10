import { CTUserGuide } from '../../../utils'

const guides = [
  {
    element: '#wp-h-search-btn',
    description: 'Find captions, video names, and shortcuts here.'
  },
  {
    element: '#menu-shortcuts',
    description: 'You can find all the accessible shortcuts here!'
  }
]

class WatchUserGuide extends CTUserGuide {
  constructor() {
    super()
    this.guides(guides)
  }

  run() {
    // this.start()
  }
}

export const guide = new WatchUserGuide()