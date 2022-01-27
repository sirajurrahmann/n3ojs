import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  selectCustomArrowStyles,
  selectStyles,
  quickInputStyles,
} from "../../styles/donationFormStyles";
import { NamedLookupRes } from "@n3oltd/umbraco-allocations-client";
import { DonationType } from "@n3oltd/umbraco-cart-client";

@customElement("quick-donation-type")
class QuickDonationType extends LitElement {
  static styles = [selectStyles, selectCustomArrowStyles, quickInputStyles];

  @property()
  options: NamedLookupRes[] = [];

  @property()
  value: DonationType = DonationType.Single;

  @property()
  onChange?: (type: DonationType) => void;

  render() {
    //language=html
    return html`
      <div class="n3o-quick-input-container">
        <select
          @change="${(e: Event) =>
            this.onChange?.(
              (e.target as HTMLSelectElement).value as DonationType,
            )}"
        >
          ${this.options.map((option) => {
            return html`<option
              .selected="${this.value === option.id}"
              value="${option.id}"
            >
              ${option.name}
            </option>`;
          })}
        </select>
      </div>
    `;
  }
}
