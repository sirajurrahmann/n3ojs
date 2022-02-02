import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ICheckoutNameForm, LayoutOption } from "./types/types";
import { nameFormStyles } from "./styles/styles";

// TODO: change one the build script is fixed for n3oltd packages
import "@n3oltd/form-elements/build";

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

  @property()
  primaryColor: string = "";

  // TODO: Fetch from API
  @property()
  titles: { id: string; value: string }[] = [
    { id: "mr", value: "Mr" },
    { id: "mrs", value: "Mrs" },
    { id: "miss", value: "Miss" },
  ];

  @state()
  _firstName: string = "";

  @state()
  _lastName: string = "";

  @state()
  _title?: { id: string; value: string };

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
                <div class="n3o-form-item-label-col">
                  <form-element-label
                    .primaryColor="${this.primaryColor}"
                    .required="${this.data.title.mandatory}"
                  >
                    <span slot="labelText">Title</span>
                  </form-element-label>
                </div>
                <div class="n3o-form-item-field-col">
                  <form-element-select
                    .options="${this.titles}"
                    .value="${this._title}"
                    .disabled="${false}"
                    .onChange="${(v: { id: string; value: string }) =>
                      (this._title = v)}"
                  ></form-element-select>
                </div>
              </div>
            </div>

            <div class="n3o-name-form-col n3o-name-form-firstName-col">
              <div class="n3o-name-form-item-row">
                <div class="n3o-form-item-label-col">
                  <form-element-label
                    .primaryColor="${this.primaryColor}"
                    .required="${this.data.firstName.mandatory}"
                  >
                    <span slot="labelText">${this.data.firstName.label}</span>
                  </form-element-label>
                </div>
                <div class="n3o-form-item-field-col">
                  <form-element-input
                    .value="${this._firstName}"
                    .onChange="${(v: string) => {
                      this._firstName = v;
                    }}"
                  ></form-element-input>
                </div>
              </div>
            </div>

            <div class="n3o-name-form-col n3o-name-form-lastName-col">
              <div class="n3o-name-form-item-row">
                <div class="n3o-form-item-label-col">
                  <form-element-label
                    .primaryColor="${this.primaryColor}"
                    .required="${this.data.lastName.mandatory}"
                  >
                    <span slot="labelText">${this.data.lastName.label}</span>
                  </form-element-label>
                </div>
                <div class="n3o-form-item-field-col">
                  <form-element-input
                    .value="${this._lastName}"
                    .onChange="${(v: string) => {
                      this._lastName = v;
                    }}"
                  ></form-element-input>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
