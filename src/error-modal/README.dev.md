# Error Modal

See main `README.md` for intended functionality of this package.

#### Development

Node version: v14.17.6 (recommend using [NVM](https://github.com/nvm-sh/nvm) to manage Node version.)

Install Dependencies:

```shell script
npm install
```

The `index.html` and `src/_sample.ts` provide a sample page using the N3O Form Elements components.

These files are provided for development purposes only and are not included in the production build.

The sample project can be run locally using the below command:

```shell script
npm run serve
```

This will watch the source files and rebuild them upon changes, as well as start a local webserver serving the `index.html` page.

Navigate to http://localhost:8000/ to view the sample project

This project uses [Lit](https://lit.dev/) as the component library, which builds on top of [Web Components Standards](https://developer.mozilla.org/en-US/docs/Web/Web_Components).

#### Formatting

[Prettier](https://prettier.io/) is installed in this project. Consider setting Prettier to format on save in your IDE.

#### Build

Code for distribution is build using [Rollup](https://rollupjs.org/guide/en/).

To build the project, run the below command

```
npm run build
```

#### Release

Release is automatic on pushing of a new tag to Github.

Create a tag on the master branch following symver conventions and push to Github to trigger build and release of a new version of the [@n3oltd/error-modal](https://www.npmjs.com/package/@n3oltd/error-modal) npm package.