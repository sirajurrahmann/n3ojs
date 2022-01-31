import { MoneyReq } from "@n3oltd/umbraco-cart-client";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { otherAmountStyles, selectCustomArrowStyles } from "../styles/donationFormStyles";
import { Currency } from "@n3oltd/umbraco-donations-client";

@customElement("other-amount")
class OtherAmount extends LitElement {
  static styles = [otherAmountStyles, selectCustomArrowStyles];

  @property()
  fixed?: boolean;

  @property()
  onChange?: (amount?: MoneyReq) => void;

  @property()
  onCurrencyChange?: (selected: Currency) => void;

  @property()
  value?: MoneyReq;

  @property()
  currencies: { text: string; symbol: string }[] = [];

  @property()
  currency?: { text: string; symbol: string };

  @property()
  showCurrencyText?: boolean;

  validateInput(target: HTMLInputElement) {
    const re = /^[0-9]+$/;
    if (re.test(target.value)) {
      this.onChange?.({
        amount: Number(target.value),
        currency: this.currency?.text as Currency,
      });
    } else {
      // Not allowing the input
      this.onChange?.();
      // Keeping the actual element value in sync with state
      target.value = "";
    }
  }

  renderSingleCurrency() {
    return html`<span class="n3o-input-amount-symbol"> ${this.currency?.symbol} </span>`;
  }

  renderMultiCurrency() {
    return html`
      <select
        class="${this.fixed ? "n3o-amount-disabled" : ""}"
        @change="${(e: Event) =>
          this.onCurrencyChange?.((e.target as HTMLSelectElement).value as Currency)}"
      >
        ${this.currencies.map((curr) => html`<option value="${curr.text}">${curr.symbol}</option>`)}
      </select>
    `;
  }

  render() {
    //language=HTML
    return html`
      <div class="n3o-donation-form-other-amount">
        <span class="n3o-amount-input ${this.fixed ? "n3o-amount-disabled" : ""}">
          <span class="n3o-amount-input-inner">
            ${this.currencies.length > 1 ? this.renderMultiCurrency() : this.renderSingleCurrency()}
            <input
              .disabled="${this.fixed}"
              .value="${this.value?.amount || ""}"
              @input="${(e: Event) => {
                if ((e.target as HTMLInputElement).value) {
                  this.validateInput(e.target as HTMLInputElement);
                } else {
                  this.onChange?.();
                }
              }}"
            />
          </span>
          ${this.showCurrencyText
            ? html` <span class="n3o-input-amount-text"> ${this.currency?.text} </span> `
            : undefined}
        </span>
      </div>
    `;
  }
}
