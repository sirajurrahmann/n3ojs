import { DonationType } from "@n3oltd/umbraco-cart-client";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { buttonStyles, frequencyStyles } from "../styles/donationFormStyles";

@customElement("frequency-selector")
class FrequencySelector extends LitElement {
  static styles = [frequencyStyles, buttonStyles];

  @property()
  onChange?: (frequency: string) => void;

  @property({ attribute: false })
  selected?: DonationType;

  @property({ attribute: false })
  disableSingle: boolean = false;

  @property({ attribute: false })
  disableRegular: boolean = false;

  @property({ attribute: false })
  regularEnabled?: DonationType;

  @property({ attribute: false })
  singleText: string = "";

  @property({ attribute: false })
  regularText: string = "";

  render() {
    //language=HTML
    return html`
      <div class="n3o-donation-frequency-container">
        <button
          aria-selected="${this.selected === DonationType.Single}"
          class="n3o-donation-form-button ${this.selected ===
          DonationType.Single
            ? "n3o-donation-form-button-selected"
            : "n3o-donation-form-button-unselected"}"
          @click="${() => this.onChange?.(DonationType.Single)}"
        >
          ${this.singleText}
        </button>
        <button
          aria-selected="${this.selected === DonationType.Regular}"
          class="n3o-donation-form-button ${this.selected ===
          DonationType.Regular
            ? "n3o-donation-form-button-selected"
            : "n3o-donation-form-button-unselected"}"
          @click="${() => this.onChange?.(DonationType.Regular)}"
        >
          ${this.regularText}
        </button>
      </div>
    `;
  }
}
