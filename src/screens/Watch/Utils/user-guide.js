import { CTUserGuide } from 'utils/user-guide'

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


export const watchUserGuide = new CTUserGuide(
    guides
)