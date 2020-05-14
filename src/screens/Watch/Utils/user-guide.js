import { isMobile } from 'react-device-detect'
import { logoOutline } from 'assets/images'
import { user, CTUserGuide } from 'utils'

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
        header: '1/3. Search in this video',
        description: 'Find captions, video names, and shortcuts here.'
    },
    {
        element: '#watch-share-btn',
        header: '2/3. Share this video moment with your class',
        description: 'Find captions, video names, and shortcuts here.'
    },
    {
        element: '#menu-language',
        header: '3/3. Captions in other languages',
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

export const generateWatchUserGuide = () => {
    return new CTUserGuide(
        guides,
        isWatchPageOnBoarded,
        { mode: 'dark'}  // switch mode into dark
    )
}


// export const watchUserGuide = new CTUserGuide(
//     guides,
//     isWatchPageOnBoarded,
//     { mode: 'dark'}  // switch mode into dark
// )