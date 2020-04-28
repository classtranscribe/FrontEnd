# ClassTranscribe Frontend

The React.js Frontend for ClassTranscribe

ClassTranscribe provides searchable transcribed video lectures. Copyright 2019-2020 University of Illinois, USA

See the [Deployment project](https://github.com/classtranscribe/Deployment) for full details and how to get started for full stack development. However if you only want to work on the Frontend and have a low powered laptop (or dont want to use Docker), you can develop the frontend website just using Node.js and yarn.

## Alternate Frontend only (no Docker) installation

1. Install [Node JS](https://nodejs.org/en/).
2. Install `yarn` (download [here](https://classic.yarnpkg.com/en/docs/install/)).

3. Clone `FrontEnd` to your machine, and enter the repo
```
$ git clone https://github.com/classtranscribe/FrontEnd.git && cd FrontEnd
```
4. In the root directory, add an `.env` file (This file should be obtained from an admin).

5. Use yarn to install Node.js dependencies.
```
$ yarn install
```
6. Run the app at [localhost:3000](http://localhost:3000)
```
$ yarn start
```
## Next steps

For more details about the existing frontnd structure and components, see [src/README.md](./src/README.md)
