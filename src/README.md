## Structure
- [App.js](./App.js) - Major routes are declared here
- [General Components](./components) - General React Components are defined
- [Redux](./redux) - Redux states, selectors, and dispatch functions are defined here
- [Azure Application Insights](./azure-app-insights) - Configurations for Azure Application Insights
- [Screens](./screens) - The major web page screens
  - [Admin](./screens/Admin) - Screens for admins
  - [Instructor](./screens/Instructor) - Screens for instructors
  - [MediaSettings](./screens/MediaSettings) - Settings for videos
  - [OfferingViewing](./screens/OfferingViewing) - The homepage
  - [Watch](./screens/Watch) - Screen for watching videos

    Each screen usually has a `/Components` directory containing all the React components used by this screen, and a `/Utils` directory containing the controllers to these components.

- [utils](./utils)
  - [links](./utils/links.js) - Pathes to different screens and window's location handlers.
  - [env](./utils/env.js) - Environment variable handlers
  - [cthttp](./utils/cthttp) - HTTP requests and response handlers for backend API's
  - [user](./utils/user) - User/Account information and action handlers
  - [search](./utils/search) - Basic search functions
  - [prompt](./utils/prompt) - Prompt component creator and controller
  - [user-preference](./utils/user-preference) - Contollers for user preference and localStorage
  - [epub-gen](./utils/epub-gen) - A ePub file generator for ClassTranscribe