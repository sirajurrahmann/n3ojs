import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { formRowStyles } from "../styles/formStyles";

@customElement("last-name-row")
class LastNameRow extends LitElement {
  static styles = formRowStyles;

  protected render() {
    //language=HTML
    return html`
      <div class="n3o-form-row">
        <div class="n3o-form-label-col">
          <span class="n3o-form-label"> Last Name </span>
        </div>

        <div class="n3o-form-input-col">
          <input type="text" class="n3o-form-input" />
        </div>
      </div>
    `;
  }
}
