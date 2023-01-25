import { GivingType } from "@n3oltd/umbraco-giving-cart-client";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { buttonStyles, frequencyStyles } from "../styles/donationFormStyles";

@customElement("frequency-selector")
class FrequencySelector extends LitElement {
  static styles = [frequencyStyles, buttonStyles];

  @property()
  onChange?: (frequency: string) => void;

  @property({ attribute: false })
  selected?: GivingType;

  @property({ attribute: false })
  disableRegular: boolean = false;

  @property({ attribute: false })
  singleText: string = "";

  @property({ attribute: false })
  regularText: string = "";

  render() {
    //language=HTML
    return html`
      <div class="n3o-donation-frequency-container">
        <button
          aria-selected="${this.selected === GivingType.Donation}"
          class="n3o-donation-form-button ${this.selected === GivingType.Donation
            ? "n3o-donation-form-button-selected"
            : "n3o-donation-form-button-unselected"}"
          @click="${() => this.onChange?.(GivingType.Donation)}"
        >
          ${this.singleText} SINGLE
          <div style=" display:block; ${this.selected === GivingType.Donation
            ? "position:relative; margin-top: 12px; left:40%; width: 0; height: 0; border-left: 24px solid transparent; border-right: 24px solid transparent; border-top: 24px solid var(--button-selected-background-color);" 
            : "display: none;"}">
          </div>
          </button>
          <button
          aria-selected="${this.selected === GivingType.RegularGiving}"
          class="n3o-donation-form-button ${this.selected === GivingType.RegularGiving
            ? "n3o-donation-form-button-selected"
            : "n3o-donation-form-button-unselected"}"
            @click="${() => this.onChange?.(GivingType.RegularGiving)}"
            >
            ${this.regularText} MONTHLY
            <div style=" display:block; ${this.selected === GivingType.RegularGiving
              ? "position:relative; margin-top: 12px; left:40%; width: 0; height: 0; border-left: 24px solid transparent; border-right: 24px solid transparent; border-top: 24px solid var(--button-selected-background-color);" 
              : "display: none;"}">
            </div>
        </button>
      </div>
    `;
  }
}
