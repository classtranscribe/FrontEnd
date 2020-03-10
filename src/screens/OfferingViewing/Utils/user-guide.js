import { CTUserGuide } from '../../../utils'

const guides = [
  {
    element: '#header_search_input',
    description: 'Find captions, video names, and shortcuts here.'
  }
]

class OffViewUserGuide extends CTUserGuide {
  constructor() {
    super()
    this.guides(guides)
  }

  run() {
    this.start()
  }
}

export const guide = new OffViewUserGuide()