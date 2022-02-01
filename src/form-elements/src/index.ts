import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "./components/FormLabel";
import "./components/FormInput";
import "./components/FormSelect";

@customElement("sample-app")
class SampleApp extends LitElement {
  @property()
  primaryColor: string = "";

  @state()
  _firstName: string = "Initial value";

  @state()
  _lastName: string = "I am disabled";

  @state()
  _country: { id: string; value: string } = {
    id: "ES",
    value: "Spain",
  };

  render() {
    // language=html
    return html`
      <div style="margin-bottom: 10px;">
        <form-element-label
          .primaryColor="${this.primaryColor}"
          .required="${true}"
        >
          <span slot="labelText">First Name</span>
        </form-element-label>
      </div>

      <div style="margin-bottom: 40px">
        <form-element-input
          .disabled="${false}"
          .value="${this._firstName}"
          .onChange="${(v: string) => {
            console.log(`Value changed: ${v}`);
            this._firstName = v;
          }}"
        ></form-element-input>
      </div>

      <div style="margin-bottom: 10px;">
        <form-element-label
          .primaryColor="${this.primaryColor}"
          .required="${false}"
        >
          <span slot="labelText">Last Name</span>
        </form-element-label>
      </div>

      <div style="margin-bottom: 40px">
        <form-element-input
          .disabled="${true}"
          .value="${this._lastName}"
          .onChange="${(v: string) => {
            this._lastName = v;
          }}"
        ></form-element-input>
      </div>

      <div style="margin-bottom: 10px;">
        <form-element-label
          .primaryColor="${this.primaryColor}"
          .required="${true}"
        >
          <span slot="labelText">Country</span>
        </form-element-label>
      </div>

      <div style="margin-bottom: 40px">
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
      </div>
    `;
  }
}
