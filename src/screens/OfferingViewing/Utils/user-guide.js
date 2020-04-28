import { user, CTUserGuide } from 'utils'

const guides = [
    {
        element: '#header_search_input',
        description: 'Find your courses here'
    }
]

async function isHomepageOnBoarded() {
    // only display user guide for logged-in users
    if (!user.isLoggedIn) {
        return true
    }
}

export const homeUserGuide = new CTUserGuide(
    guides,
    {
        buttonColor: '#328383',
        skipButtonColor: 'rgb(63,63,63)'
    },
    isHomepageOnBoarded
)