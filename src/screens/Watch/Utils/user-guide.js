import { isMobile } from 'react-device-detect'
import { logoOutline } from 'assets/images'
import { user, CTUserGuide } from 'utils'

const guides = [
    {
        intro: true,
        header: 'Start watching your first video',
        description: 'Get to know the helpful tools',
        imgURL: logoOutline
    },
    {
        element: '#wp-h-search-btn',
        header: 'Search for captions',
        description: 'Find captions, video names, and shortcuts here.'
    }
]

async function isWatchPageOnBoarded() {
    // only display user guide for logged-in users
    if (!user.isLoggedIn || isMobile) {
        return true
    }

    return false
}


export const watchUserGuide = new CTUserGuide(
    guides,
    isWatchPageOnBoarded,
    {mode: 'dark'} // switch to dark mode
)