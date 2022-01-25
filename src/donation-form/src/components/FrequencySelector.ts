import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import { Frequency } from "../types";
import { buttonStyles, frequencyStyles } from "../styles/donationFormStyles";

@customElement("frequency-selector")
class FrequencySelector extends LitElement {
  static styles = [frequencyStyles, buttonStyles];

  @property()
  onChange?: (frequency: string) => void;

  @property({ attribute: false })
  selected?: Frequency;

  @property({ attribute: false })
  disableSingle: boolean = false;

  @property({ attribute: false })
  disableRegular: boolean = false;

  @property({ attribute: false })
  regularEnabled?: Frequency;

  @property({ attribute: false })
  singleText: string = "";

  @property({ attribute: false })
  regularText: string = "";

  render() {
    //language=HTML
    return html`
      <div class="n3o-donation-frequency-container">
        <button
          aria-selected="${this.selected === Frequency.single}"
          class="n3o-donation-form-button ${this.selected === Frequency.single
            ? "n3o-donation-form-button-selected"
            : "n3o-donation-form-button-unselected"}"
          @click="${() => this.onChange?.(Frequency.single)}"
        >
          ${this.singleText}
        </button>
        <button
          aria-selected="${this.selected === Frequency.regular}"
          class="n3o-donation-form-button ${this.selected === Frequency.regular
            ? "n3o-donation-form-button-selected"
            : "n3o-donation-form-button-unselected"}"
          @click="${() => this.onChange?.(Frequency.regular)}"
        >
          ${this.regularText}
        </button>
      </div>
    `;
  }
}
