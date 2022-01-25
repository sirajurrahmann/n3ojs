import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Currency, PriceHandleRes } from "@n3oltd/umbraco-donations-client";
import {
  amountSelectorStyles,
  buttonStyles,
} from "../styles/donationFormStyles";

@customElement("amount-selector")
class AmountSelector extends LitElement {
  static styles = [buttonStyles, amountSelectorStyles];

  @property()
  // TODO: Remove sample data
  _priceHandles: PriceHandleRes[] = [
    {
      amount: {
        amount: 20,
        currency: "GBP" as Currency,
        text: "£20",
      },
      description:
        "Yemen Bread Factory: Produces 500 loaves of bread (feeds 500 people).",
    },
    {
      amount: {
        amount: 50,
        currency: "GBP" as Currency,
        text: "£50",
      },
      description:
        "Yemen Bread Factory: Produces 2,000 loaves of bread (feeds 1,500 people).",
    },
    {
      amount: {
        amount: 100,
        currency: "GBP" as Currency,
        text: "£1000",
      },
      description: "Fund the bread factory for a month",
    },
  ];

  @property()
  onChange?: (frequency: PriceHandleRes) => void;

  @property()
  value?: PriceHandleRes;

  render() {
    //language=HTML
    return html`
      <div>
        <div class="n3o-donation-form-price-select">
          ${this._priceHandles.map((handle) => {
            return html`<button
              aria-selected="this.selected?.amount?.text ===
            handle.amount?.text"
              class="n3o-donation-form-button ${this.value?.amount?.text ===
              handle.amount?.text
                ? "n3o-donation-form-button-selected"
                : "n3o-donation-form-button-unselected"}"
              @click="${() => this.onChange?.(handle)}"
            >
              ${handle.amount?.text}
            </button>`;
          })}
        </div>
        <div class="n3o-donation-form-price-desc">
          ${this.value?.description}
        </div>
      </div>
    `;
  }
}
