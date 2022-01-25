import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { formRowStyles } from "../../styles/formStyles";

@customElement("email-sms-form")
class EmailSmsForm extends LitElement {
  static styles = formRowStyles;

  protected render() {
    //language=HTML
    return html`
      <div class="n3o-form-row">
        <div class="n3o-form-label-col">
          <span class="n3o-form-label"> Email </span>
        </div>

        <div class="n3o-form-input-col">
          <input
            type="email"
            placeholder="Enter Email Address"
            class="n3o-form-input"
          />
        </div>
      </div>

      <div class="n3o-form-row">
        <div class="n3o-form-label-col">
          <span class="n3o-form-label"> Phone Number </span>
        </div>

        <div class="n3o-form-input-col">
          <input
            type="text"
            placeholder="Enter Phone Number"
            class="n3o-form-input"
          />
        </div>
      </div>
    `;
  }
}
