import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { formRowStyles } from "../styles/formStyles";

import "./shared/FormItemLabel";

@customElement("country-row")
class CountryRow extends LitElement {
  static styles = formRowStyles;

  @property()
  countries: { name: string; id: string }[] = [];

  @property()
  onChange?: (country: string) => void;

  @property()
  primaryColor: string = "";

  protected render() {
    //language=HTML
    return html`
      <div class="n3o-form-row">
        <div class="n3o-form-label-col">
          <form-item-label
            .primaryColor="${this.primaryColor}"
            .required="${true}"
          >
            <span slot="labelText">Country</span>
          </form-item-label>
        </div>

        <div class="n3o-form-input-col">
          <select
            class="n3o-form-input n3o-form-input-select"
            name="title"
            @change="${(e: Event) =>
              this.onChange?.((e.target as HTMLSelectElement).value)}"
          >
            ${this.countries.map(
              (c) => html`<option value="${c.id}">${c.name}</option>`,
            )}
          </select>
        </div>
      </div>
    `;
  }
}
