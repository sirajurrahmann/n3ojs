import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { selectCustomArrowStyles, selectStyles } from "../../styles/donationFormStyles";
import { NamedLookupRes } from "@n3oltd/umbraco-allocations-client";
import { DonationType } from "@n3oltd/umbraco-cart-client";

@customElement("quick-donation-type")
class QuickDonationType extends LitElement {
  static styles = [selectStyles, selectCustomArrowStyles];

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
            this.onChange?.((e.target as HTMLSelectElement).value as DonationType)}"
        >
          <option .selected="${this.value === DonationType.Single}" value="${DonationType.Single}">
            ${this.options.find((o) => o.id === DonationType.Single)?.name}
          </option>
          <option
            .selected="${this.value === DonationType.Regular}"
            value="${DonationType.Regular}"
          >
            ${this.options.find((o) => o.id === DonationType.Regular)?.name}
          </option>
        </select>
      </div>
    `;
  }
}
