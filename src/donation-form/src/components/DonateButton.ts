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
    //language=HTML
    return html`
      <div class="n3o-donate-button" @click="${this.onClick}">
        <button .disabled="${this.saving}" class="n3o-donation-form-button">
          ${this.buttonText}
        </button>
      </div>
    `;
  }
}
