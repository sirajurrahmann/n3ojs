import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { formRowStyles } from "../../styles/formStyles";

@customElement("address-fields-gb")
class AddressFieldsGB extends LitElement {
  static styles = formRowStyles;
  static addressLines = [
    { name: "line1", text: "Line 1" },
    { name: "line2", text: "Line 2" },
    { name: "line3", text: "Line 3" },
    { name: "townCity", text: "Town/City" },
  ];

  @property()
  countries: { name: string; id: string }[] = [];

  @property()
  onChange?: (country: string) => void;

  protected render() {
    //language=HTML
    return html`
      <div>
        <div class="n3o-form-row">
          <div class="n3o-form-label-col">
            <span class="n3o-form-label"> Post Code </span>
          </div>

          <div class="n3o-form-input-col">
            <input type="text" class="n3o-form-input" />
          </div>
        </div>

        ${AddressFieldsGB.addressLines.map(
          (line) => html`
            <div class="n3o-form-row">
              <div class="n3o-form-label-col">
                <span class="n3o-form-label"> ${line.text} </span>
              </div>

              <div class="n3o-form-input-col">
                <input name="${line.name}" type="text" class="n3o-form-input" />
              </div>
            </div>
          `,
        )}
      </div>
    `;
  }
}
