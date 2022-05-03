# AutoCapitalize

See main `README.md` for intended functionality of this package.

#### Development

Node version: v14+ (recommend using [NVM](https://github.com/nvm-sh/nvm) to manage Node version.)

Install Dependencies:

```shell script
npm install
```

The `index.html` provides a sample page using the autocapitalize util.

This file is provided for development purposes only and is not included in the production build.

File can be built for testing purposes running the below command

```shell script
npm run dev
```

This will build source files for running in the browser.

Open the `index.html` page in the browser to view the sample project

#### Formatting

[Prettier](https://prettier.io/) is installed in this project. Consider setting Prettier to format on save in your IDE.

#### Build

To build the project for release, run the below command

```
npm run build
```

#### Release

Release is automatic on pushing of a new tag to Github.

Create a tag on the master branch following symver conventions and push to Github to trigger build and release of a new version of the [@n3oltd/error-modal](https://www.npmjs.com/package/@n3oltd/error-modal) npm package.