import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { selectCustomArrowStyles, selectStyles } from "../../styles/donationFormStyles";
import { NamedLookupRes } from "@n3oltd/umbraco-giving-client";
import { GivingType } from "@n3oltd/umbraco-cart-client";

@customElement("quick-donation-type")
class QuickDonationType extends LitElement {
  static styles = [selectStyles, selectCustomArrowStyles];

  @property()
  options: NamedLookupRes[] = [];

  @property()
  value: GivingType = GivingType.Donation;

  @property()
  onChange?: (type: GivingType) => void;

  render() {
    //language=html
    return html`
      <div class="n3o-quick-input-container">
        <select
          @change="${(e: Event) =>
            this.onChange?.((e.target as HTMLSelectElement).value as GivingType)}"
        >
          <option .selected="${this.value === GivingType.Donation}" value="${GivingType.Donation}">
            ${this.options.find((o) => o.id === GivingType.Donation)?.name}
          </option>
          <option
            .selected="${this.value === GivingType.RegularGiving}"
            value="${GivingType.RegularGiving}"
          >
            ${this.options.find((o) => o.id === GivingType.RegularGiving)?.name}
          </option>
        </select>
      </div>
    `;
  }
}
