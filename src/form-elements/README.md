# lit-starter

A N3O Package for use in client websites.

This package provides form elements that can be used in other N3O Lit projects.


### Usage

As with all n3o frontend packages, install the package in the JS directory of the given client project.

```shell script
npm install @n3o/form-elements
```

### Basic Use

TODO: Complete this

Form elements are designed to be used as Controlled Components, where the parent component keeps track of the state of the component and passed the current value down to the component as a property.
 

### Styling

Lit creates a Shadow DOM for each web component that is rendered within the document.

As such, developers do not have full control over shadow DOM styling from the outside.

Styles can be configured by setting CSS variables. Full list of CSS variables which may be configured for this component are listed in the demo code in `index.html`.

Additional variables can easily be added, please contact the project authors or open a PR.