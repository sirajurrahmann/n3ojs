import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { buttonStyles, donateButtonStyles } from "../styles/donationFormStyles";

@customElement("donate-button")
class DonateButton extends LitElement {
  static styles = [donateButtonStyles, buttonStyles];

  @property()
  buttonText: string = "Donate Now";

  @property()
  onClick?: () => void;

  @property()
  saving?: boolean;

  render() {
    // TODO: Loading icon or similar?
    //language=HTML
    return html`
      <div class="n3o-donate-button" @click="${this.onClick}">
        <button
          class="n3o-donation-form-button ${this.saving
            ? "n3o-button-disabled"
            : ""}"
        >
          ${this.buttonText}
        </button>
      </div>
    `;
  }
}
