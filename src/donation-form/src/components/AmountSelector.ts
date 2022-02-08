import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { PriceHandleRes } from "@n3oltd/umbraco-giving-client";
import { amountSelectorStyles, buttonStyles } from "../styles/donationFormStyles";
import { MoneyRes } from "@n3oltd/umbraco-giving-client/src/index";

@customElement("amount-selector")
class AmountSelector extends LitElement {
  static styles = [buttonStyles, amountSelectorStyles];

  @property()
  priceHandles: PriceHandleRes[] = [];

  @property()
  onChange?: (frequency: PriceHandleRes) => void;

  @property()
  selectedCurrencyId?: string;

  @property()
  value?: PriceHandleRes;

  getPriceHandleTextForCurrency(currencyValues: { [key: string]: MoneyRes }): string {
    if (this.selectedCurrencyId) {
      let text = currencyValues[this.selectedCurrencyId.toLowerCase()]?.text;
      if (text?.endsWith(".00")) text = text.slice(0, -3);
      return text || "";
    }
    return "";
  }

  isHandleSelected(handle: PriceHandleRes): boolean {
    return handle.amount === this.value?.amount;
  }

  render() {
    //language=HTML
    return html`
      <div>
        <div class="n3o-donation-form-price-select">
          ${this.priceHandles.map((handle) => {
            return html`<button
              aria-selected="this.selected?.amount?.text ===
            handle.amount?.text"
              class="n3o-donation-form-button ${this.isHandleSelected(handle)
                ? "n3o-donation-form-button-selected"
                : "n3o-donation-form-button-unselected"}"
              @click="${() => this.onChange?.(handle)}"
            >
              ${this.getPriceHandleTextForCurrency(handle.currencyValues || {})}
            </button>`;
          })}
        </div>
        <div class="n3o-donation-form-price-desc">${this.value?.description}</div>
      </div>
    `;
  }
}
