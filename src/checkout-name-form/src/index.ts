import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ICheckoutNameForm, LayoutOption } from "./types/types";
import { nameFormStyles } from "./styles/styles";

@customElement("checkout-name-form")
class CheckoutNameForm extends LitElement {
  static styles = nameFormStyles;

  @property({ attribute: false })
  data: ICheckoutNameForm = {
    title: {
      mandatory: true,
      label: "Title",
      order: 0,
    },
    firstName: {
      mandatory: true,
      label: "First Name",
      order: 1,
    },
    lastName: {
      mandatory: true,
      label: "Last Name",
      order: 2,
    },
  };

  @property()
  layout: LayoutOption = LayoutOption.Vertical;

  render() {
    // language=html
    return html`
      <div>
        <div class="n3o-name-form-container">
          <div
            class="n3o-name-form-row ${this.layout === LayoutOption.Horizontal
              ? "n3o-form-horizontal"
              : "n3o-form-vertical"}"
          >
            <div class="n3o-name-form-col n3o-name-form-title-col">
              <div class="n3o-name-form-item-row">
                <div
                  class="n3o-form-item-label-col ${this.data.title.mandatory
                    ? "n3o-form-label-required"
                    : ""}"
                >
                  ${this.data.title.label}
                </div>
                <div class="n3o-form-item-field-col">
                  <select>
                    <option value="mr">Mr</option>
                    <option value="mrs">Mrs</option>
                    <option value="miss">Miss</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="n3o-name-form-col n3o-name-form-firstName-col">
              <div class="n3o-name-form-item-row">
                <div
                  class="n3o-form-item-label-col ${this.data.firstName.mandatory
                    ? "n3o-form-label-required"
                    : ""}"
                >
                  ${this.data.firstName.label}
                </div>
                <div class="n3o-form-item-field-col">
                  <input />
                </div>
              </div>
            </div>

            <div class="n3o-name-form-col n3o-name-form-lastName-col">
              <div class="n3o-name-form-item-row">
                <div
                  class="n3o-form-item-label-col ${this.data.lastName.mandatory
                    ? "n3o-form-label-required"
                    : ""}"
                >
                  ${this.data.lastName.label}
                </div>
                <div class="n3o-form-item-field-col">
                  <input />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
