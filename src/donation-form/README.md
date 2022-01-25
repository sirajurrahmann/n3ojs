# donation-form

### Questions

- "We accept all major credit cards and PayPal" - pass in as property?
- What aspects (visual) are configurable?

A N3O Package for use in client websites.

Adds the Donation Form to checkout.

E.g.

![Example](./_files/example.png)

Data is fetched from GET `/umbraco/api/Donations/forms/{id}`. The ID can be found in your Umbraco project under Content -> Giving -> Donate Page. The ID for this form is visible by clicking on "Donate Page" and on the top right hand corner of the screen, selecting "Info". The ID number you want is the long GUID.

### Usage

As with all n3o frontend packages, install the package in the JS directory of the given client project.

```shell script
npm install @n3o/donation-form
```

```html
<script type="module">
    const el = document.querySelector("#donationForm");
    el.data = {
      formId: "a8492d39-1455-4de4-bcb2-e4d014d9bfc5",
      baseUrl: "https://localhost:5001",
      primaryColor: "#4FAF46",
      showFrequencyFirst: true,
      singleText: "Single",
      regularText: "Monthly"
    };
  </script>

<data-donation-form id="donationForm"> </data-donation-form>
```

### Styling

Lit creates a Shadow DOM for each web component that is rendered within the document.

Styles can be passed to the root component for