import { MoneyReq } from "@n3oltd/umbraco-giving-cart-client";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { otherAmountStyles, selectCustomArrowStyles } from "../styles/donationFormStyles";
import { CurrencyRes } from "@n3oltd/umbraco-giving-client";

@customElement("other-amount")
class OtherAmount extends LitElement {
  static styles = [otherAmountStyles, selectCustomArrowStyles];

  @property()
  fixed?: boolean;

  @property()
  onChange?: (amount?: MoneyReq) => void;

  @property()
  onCurrencyChange?: (selected?: CurrencyRes) => void;

  @property()
  value?: MoneyReq;

  @property()
  currencies: CurrencyRes[] = [];

  @property()
  selectedCurrencyId?: string;

  @property()
  showCurrencyText?: boolean;

  validateInput(target: HTMLInputElement) {
    const re = /^[0-9]+$/;
    if (re.test(target.value)) {
      this.onChange?.({
        amount: Number(target.value),
        currency: this.currencies?.find(
          (c) => c.id?.toLowerCase() === this.selectedCurrencyId?.toLowerCase(),
        )?.id,
      });
    } else {
      // Not allowing the input
      this.onChange?.();
      // Keeping the actual element value in sync with state
      target.value = "";
    }
  }

  renderSingleCurrency() {
    return html`<span class="n3o-input-amount-symbol">
      ${this.currencies?.find((c) => c.id?.toLowerCase() === this.selectedCurrencyId?.toLowerCase())
        ?.symbol}
    </span>`;
  }

  renderMultiCurrency() {
    return html`
      <select
        class="${this.fixed ? "n3o-amount-disabled" : ""}"
        @change="${(e: Event) => {
          const currencySelected = this.currencies.find(
            (c) => c.id === (e.target as HTMLSelectElement).value,
          );
          this.onCurrencyChange?.(currencySelected);
        }}"
      >
        ${this.currencies.map((curr) => {
          return html`<option
            .selected="${this.selectedCurrencyId?.toLowerCase() === curr.id?.toLowerCase()}"
            value="${curr.id}"
          >
            ${curr.symbol}
          </option>`;
        })}
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
            ? html`
                <span class="n3o-input-amount-text">
                  ${this.currencies?.find(
                    (c) => c.id?.toLowerCase() === this.selectedCurrencyId?.toLowerCase(),
                  )?.code}
                </span>
              `
            : undefined}
        </span>
      </div>
    `;
  }
}
