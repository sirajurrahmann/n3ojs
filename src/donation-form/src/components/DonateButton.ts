import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { buttonStyles, donateButtonStyles, iconStyle } from "../styles/donationFormStyles";
import { DonationFormHelpers } from "../helpers";
import defaultIcons from "../config/icons";
import { IconVariety } from "../types";

@customElement("donate-button")
class DonateButton extends LitElement {
  static styles = [donateButtonStyles, buttonStyles, iconStyle];

  @property()
  buttonText: string = "Donate Now";

  @property()
  onClick?: () => void;

  @property()
  iconName: string = defaultIcons.donateButton.icon;

  @property()
  iconVariety: IconVariety = defaultIcons.donateButton.variety;

  @property()
  saving?: boolean;

  render() {
    if (this.iconName !== null) {
      //language=HTML
      return html`
      <div class="n3o-donate-button" @click="${this.onClick}">
        <button class="n3o-donation-form-button ${this.saving ? "n3o-button-disabled" : ""}">
          <span class="${DonationFormHelpers.getMaterialIconName(this.iconVariety)} icon">
            ${this.iconName}
          </span>
          ${this.saving ? "Saving..." : this.buttonText}
        </button>
      </div>
    `;
    } else {
      //language=HTML
      return html`
      <div class="n3o-donate-button" @click="${this.onClick}">
        <button class="n3o-donation-form-button ${this.saving ? "n3o-button-disabled" : ""}">
          ${this.saving ? "Saving..." : this.buttonText}
        </button>
      </div>
    `;
    }
  }
}
