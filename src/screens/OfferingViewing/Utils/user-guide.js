import { isMobile } from 'react-device-detect'
import { logoOutline } from 'assets/images'
import { user, CTUserGuide } from 'utils'

const guides = [
    {
        intro: true,
        header: 'Welcome to ClassTranscribe',
        description: 'Start your quick tour to the website',
        imgURL: logoOutline
    },{
        element: 'a[data-rb-event-key="search"]',
        description: 'Find your courses here'
    },{
        element: 'a[data-rb-event-key="history"]',
        description: 'Browse your watch histories'
    }
]

async function isHomepageOnBoarded() {
    // only display user guide for logged-in users
    if (!user.isLoggedIn || isMobile) {
        return true
    }

    return false
}

export const homeUserGuide = new CTUserGuide(
    guides,
    isHomepageOnBoarded
)