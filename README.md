# N3O JS Utility Library

Release steps:

- Clone this repo

- Run npm prepack script

```$xslt
npm run prepack
```

- Inside the `dist` directory we should programmatically create a `LICENCE` file, a `README.md` file and the `package.json` file. We could do this in C# as we do for the NPM clients, or could add it into the build script here

---

In Website Project:

- Create a `js` directory inside the Website Project (top level)
- `npm init` inside `js`
- Create `index.ts`
- Install any n3o packages required e.g. `npm install @n3o/auto-capitalize`
- Inside `index.ts` require any packages and initialize them/use them as required
- There would need to be a build step as part of website release to build the `js/index.ts` file into `Read.Web/assets/js/n3o.js`