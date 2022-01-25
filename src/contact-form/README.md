# contact-form

Questions:
- Do we want name/title section separate to address?
- Billing address/contact address should be different?
- UK by default, should be country specific?
- Required fields
- Pass in current donor address from template file or fetch from API?
- Will these separate components (e.g. address form, payment form) need to communicate between one another?
- Can we use normal n3o packages in these projects? E.g. if I want TypeScript enums for lookup values etc? (Country)
- Lookups will come from Umbraco APIs. There are Static lookups (never change) and Content Lookups which are entered as content on Umbraco and then made available as lookups and exposed via an API. 
- What about lookups like Titles etc? Fetch from somewhere, or can we pass as a config option to the component?
- How to share styles across components - separate project?
- Validation APIs? Rules? How to pass in/fetch
- Do we have a postcode search functionality?
- If country changes, preserve as much data as possible that was entered in address fields?
 

---

A N3O Package for use in client websites.

Adds the Contact Form to checkout.

### Usage

As with all n3o frontend packages, install the package in the JS directory of the given client project.

```shell script
npm install @n3o/contact-form
```

It is assumed that the `@n3o/contact-form` package, along with other N3O JS packages, will be bundled into a single `n3o.js` file which will then be included in client sites. However, you are free to use `@n3o/contact-form` on its own and a distribution version is available in `/dist`.

To initialize the ContactForm:
 
```javascript
import ContactForm from "@n3o/contact-form";

 ContactForm.init("#contactForm", {
  country: "GB"
});
```

Where `"#contactForm"` is the query selector for the custom element into which you want to render the Contact Form.

It is expected that you will have an empty custom `data-contact-form` element in your markup, as below:

```html
<data-contact-form id="contactForm"> </data-contact-form>
```

#### Styling


