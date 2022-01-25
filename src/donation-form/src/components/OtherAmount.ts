import { MoneyReq } from "@n3oltd/umbraco-cart-client";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { otherAmountStyles } from "../styles/donationFormStyles";

@customElement("other-amount")
class OtherAmount extends LitElement {
  static styles = otherAmountStyles;

  @property()
  onChange?: (amount?: MoneyReq) => void;

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
        currency: this.currency,
      });
    } else {
      // Not allowing the input
      this.onChange?.();
      // Keeping the actual element value in sync with state
      target.value = "";
    }
  }

  render() {
    //language=HTML
    return html`
      <div class="n3o-donation-form-other-amount">
        <span class="n3o-amount-input">
          <span>
            <span class="n3o-input-amount-symbol">
              ${this.currency?.symbol}
            </span>
            <input
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
            ? html`
                <span class="n3o-input-amount-text">
                  ${this.currency?.text}
                </span>
              `
            : undefined}
        </span>
      </div>
    `;
  }
}
