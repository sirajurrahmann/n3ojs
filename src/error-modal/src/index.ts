import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

import "./components/ErrorModal";

@customElement("sample-app")
class SampleApp extends LitElement {
  @state()
  _showing: boolean = false;

  render() {
    //language=html
    return html`
      <div>
        <button @click="${() => (this._showing = true)}">
          Click to raise error
        </button>
      </div>
      <error-modal
        .showing="${this._showing}"
        .onClose="${() => (this._showing = false)}"
        .errors="${[
          "Please enter an amount for your donation.",
          "Please enter a location for your donation",
        ]}"
      ></error-modal>
    `;
  }
}
