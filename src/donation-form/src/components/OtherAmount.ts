import { MoneyReq } from "@n3oltd/umbraco-giving-cart-client";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { otherAmountStyles, selectCustomArrowStyles } from "../styles/donationFormStyles";
import { CurrencyRes, SponsorshipDurationRes } from "@n3oltd/umbraco-giving-client";
import quantities from "../config/quantities";
import { DonationFormHelpers } from "../helpers";

@customElement("other-amount")
class OtherAmount extends LitElement {
  static styles = [otherAmountStyles, selectCustomArrowStyles];

  @property()
  baseUrl: string = "";

  @property()
  fixed?: boolean;

  @property()
  showQuantitySelector?: boolean;

  @property()
  showDurationSelector?: boolean;

  @property()
  duration?: string;

  @property()
  onChangeDuration?: (v?: SponsorshipDurationRes) => void;

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
  onChangeQuantity?: (val?: number) => void;

  @property()
  quantity: number = 1;

  @property()
  showCurrencyText?: boolean;

  @property()
  isRegular?: boolean;

  @property()
  isSponsorship?: boolean;

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
        class="n3o-select-currency"
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
        <span
          class="n3o-amount-input ${this.fixed && !this.showQuantitySelector
            ? "n3o-amount-disabled"
            : ""}"
        >
          <span class="n3o-amount-input-inner">
            ${this.currencies.length > 1 ? this.renderMultiCurrency() : this.renderSingleCurrency()}
            ${this.showDurationSelector
              ? html`<sponsorship-duration
                  .hideBorder="${true}"
                  .currencies="${this.currencies}"
                  .value="${this.duration}"
                  .quantity="${this.quantity}"
                  .onChange="${this.onChangeDuration}"
                  .baseUrl="${this.baseUrl}"
                  .amount="${this.value}"
                ></sponsorship-duration>`
              : this.showQuantitySelector
              ? html`
                  <select
                    class="n3o-select-quantity"
                    .disabled="${this.fixed && !this.showQuantitySelector}"
                    @change="${(e: Event) => {
                      this.onChangeQuantity?.(Number((e.target as HTMLSelectElement).value));
                    }}"
                  >
                    ${quantities?.map((q) => {
                      return html`<option .selected="${q === this.quantity}" value="${q}">
                        ${q} ${this.isSponsorship ? (q === 1 ? "Sponsorship" : "Sponsorships") : ""}
                        @
                        ${this.currencies?.find(
                          (c) => c.id?.toLowerCase() === this.selectedCurrencyId?.toLowerCase(),
                        )?.symbol}${DonationFormHelpers.removeTrailingZeros(
                          this.value?.amount?.toFixed(2),
                        )}
                        (${DonationFormHelpers.getAndFormatTotal(
                          q,
                          this.currencies.find(
                            (c) => this.value?.currency?.toLowerCase() === c.id?.toLowerCase(),
                          ),
                          this.value,
                        )}${this.isRegular ? "/month" : ""})
                      </option>`;
                    })}
                  </select>
                `
              : html`
                  <input
                    placeholder="Enter Amount"
                    class="n3o-input-amount"
                    .value="${this.value?.amount || ""}"
                    .disabled="${this.fixed && !this.showQuantitySelector}"
                    @input="${(e: Event) => {
                      if ((e.target as HTMLInputElement).value) {
                        this.validateInput(e.target as HTMLInputElement);
                      } else {
                        this.onChange?.();
                      }
                    }}"
                  />
                `}
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
