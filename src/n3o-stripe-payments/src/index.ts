import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

// Do we want to remove the JQuery dependency?
// How to rebuild the modal
// This is just an example setup for a Project that uses Lit

@customElement("data-stripe-form")
class StripeForm extends LitElement {
  @property({ attribute: false })
  data: { amount: number } = { amount: 0 };

  @property()
  currency = "GBP";

  render() {
    return html`
      <p>This is a starter project for a N3O NPM Package that uses Lit.</p>
      <p>Current Amount: ${this.data.amount} ${this.currency}</p>
    `;
  }
}
