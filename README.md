# ClassTranscribe Frontend

The React.js Frontend for ClassTranscribe

ClassTranscribe provides searchable transcribed video lectures. Copyright 2019-2020 University of Illinois, USA

See the [Deployment project](https://github.com/classtranscribe/Deployment) for more details and how to get started for full stack development. 

## Alternate Frontend only (no Docker) installation

### Prerequisites
1. Install [Node JS](https://nodejs.org/en/).
2. Install `yarn` (download [here](https://classic.yarnpkg.com/en/docs/install/)).

### 
1. Clone `FrontEnd` to your machine, and enter the repo
```
$ git clone https://github.com/classtranscribe/FrontEnd.git && cd FrontEnd
```
2. In the root directory, add an `.env` file (This file should be obtained from an admin).
3. Install Node JS dependencies.
```
$ yarn install
```
4. Run the app at [localhost:3000](http://localhost:3000)
```
$ yarn start
```
5. For more details about the existing structure/components, see [src/README.md](./src/README.md)
