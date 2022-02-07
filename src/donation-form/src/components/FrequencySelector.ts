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
          ${this.singleText}
        </button>
        <button
          aria-selected="${this.selected === GivingType.RegularGiving}"
          class="n3o-donation-form-button ${this.selected === GivingType.RegularGiving
            ? "n3o-donation-form-button-selected"
            : "n3o-donation-form-button-unselected"}"
          @click="${() => this.onChange?.(GivingType.RegularGiving)}"
        >
          ${this.regularText}
        </button>
      </div>
    `;
  }
}
