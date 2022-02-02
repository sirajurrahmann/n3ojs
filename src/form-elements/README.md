# form-elements

A N3O Package for use in client websites.

This package provides form elements that can be used in other N3O Lit projects.


### Usage

As with all n3o frontend packages, install the package in the JS directory of the given client project.

```shell script
npm install @n3o/form-elements
```

Require the elements you need:

```javascript
import "@n3oltd/form-elements/src/components/FormLabel";
import "@n3oltd/form-elements/src/components/FormInput";
import "@n3oltd/form-elements/src/components/FormSelect";
```

Or require all elements:

```javascript
import "@n3oltd/form-elements";
```

---

# List of Elements

Form elements are designed to be used as Controlled Components, where the parent component keeps track of the state of the component and passed the current value down to the component as a property.

## Label Element

In your Lit application code:
```html
<form-element-label
      .primaryColor="${this.primaryColor}"
      .required="${true}"
    >
      <span slot="labelText">Country</span>
</form-element-label>
```

`form-element-label` requires the below CSS variables to be set to control styling

In HTML file:
```html
<style>
your-app-name {
    --label-font: Arial, sans-serif;
    --label-font-size: 16px;
    --label-text-transform: capitalize;
    --label-text-color: #A6A4A3;
    --label-font-weight: 600;

    /* Will be the asterisk color if label is required */
    --theme-color: #4FAF46;
}
</style>
```

## Text Input Element

In your Lit application code:
```html
<form-element-input
  .disabled="${true}"
  .required="${true}"
  .requiredMessage="${"Last Name is required"}"
  .error="${this._error}"
  .capitalizationOption="${CapitalizationOption.Capitalize}"
  .value="${this._lastName}"
  .onChange="${(v: string) => {
      this._lastName = v;
  }}"
  .validateInput="${(target: HTMLInputElement) => {
      if (target.value?.length > 0 && target.value?.length <= 1)
        this._error = "Last Name is too short";
      else {
        this._error = undefined;
      }
   }}"
></form-element-input>
```

`form-element-input` requires the below CSS variables to be set to control styling

In HTML file:
```html
<style>
your-app-name {
    --input-height: 28px;
    --input-font-size: 16px;
    --input-box-shadow: 0 0 0 0.2rem rgba(79, 175, 70, 0.5);
    --theme-color: #4FAF46;
    --text-color: rgb(33, 37, 41);
    --disabled-text-color: rgba(33, 37, 41, 0.6);
    --input-border-radius: 4px;
}
</style>
```

## Select Element

In your Lit application code:
```html
<form-element-select
  .options="${[
    {
      id: "GB",
      value: "United Kingdom",
    },
    {
      id: "ES",
      value: "Spain",
    },
    {
      id: "CA",
      value: "Canada",
    },
  ]}"
  .value="${this._country}"
  .disabled="${false}"
  .onChange="${(v: { id: string; value: string }) =>
    (this._country = v)}"
></form-element-select>
```

`form-element-input` requires the below CSS variables to be set to control styling

In HTML file:
```html
<style>
your-app-name {
    --input-height: 28px;
    --input-font-size: 16px;
    --input-box-shadow: 0 0 0 0.2rem rgba(79, 175, 70, 0.5);
    --theme-color: #4FAF46;
    --text-color: rgb(33, 37, 41);
    --disabled-text-color: rgba(33, 37, 41, 0.6);
    --input-border-radius: 4px;

    /* NOTE: Hex colour here must begin with %23 not # as # character is considered a fragment identifier. */
    --select-dropdown-url: url("data:image/svg+xml;utf8,<svg fill='%234FAF46' height='26' viewBox='0 0 26 26' width='26' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
}
</style>
```