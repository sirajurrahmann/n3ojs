import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AllocationType, DonationOptionRes } from "@n3oltd/umbraco-giving-client/src/index";
import { CurrencyRes, DonationItemRes, SponsorshipSchemeRes } from "@n3oltd/umbraco-giving-client";
import { selectCustomArrowStyles, selectStyles } from "../styles/donationFormStyles";
import { DonationFormType } from "../types";
import { MoneyReq } from "@n3oltd/umbraco-giving-cart-client";
import { DonationFormHelpers } from "../helpers";

@customElement("fund-selector")
class FundSelector extends LitElement {
  static styles = [selectStyles, selectCustomArrowStyles];

  @property()
  variation: DonationFormType = DonationFormType.Full;

  @property()
  value?: DonationOptionRes;

  @property()
  fixedAmount?: MoneyReq;

  @property()
  showFixedAmountInOption?: boolean = false;

  @property()
  selectedCurrencyId?: string;

  @property()
  onChange?: (option?: DonationOptionRes) => void;

  @property()
  options: DonationOptionRes[] = [];

  @property()
  donationItems: DonationItemRes[] = [];

  @property()
  sponsorshipSchemes: SponsorshipSchemeRes[] = [];

  getItemName(option: DonationOptionRes): string {
    let name: string;
    if (option.type === "fund") {
      name = this.donationItems.find((d) => d.id === option.fund?.donationItem)?.name || "";
    } else {
      name = this.sponsorshipSchemes.find((s) => s.id === option.sponsorship?.scheme)?.name || "";
    }
    if (!this.showFixedAmountInOption) {
      return name;
    }

    const pricing = DonationFormHelpers.getPricing(
      option,
      this.donationItems,
      this.sponsorshipSchemes,
    );

    const matchingPricingRule = DonationFormHelpers.getMatchingPricingRule(
      pricing?.priceRules || [],
      {
        dimension1: option.dimension1?.fixed || option.dimension1?.default,
        dimension2: option.dimension2?.fixed || option.dimension2?.default,
        dimension3: option.dimension3?.fixed || option.dimension3?.default,
        dimension4: option.dimension4?.fixed || option.dimension4?.default,
      },
    );

    // First we check whether a matching price rule is locked, which is more specific
    if (matchingPricingRule && matchingPricingRule.locked) {
      return `${name} (${DonationFormHelpers.removeTrailingZeros(
        matchingPricingRule.currencyValues?.[this.selectedCurrencyId || ""]?.text || "",
      )})`;

      // Then we check whether the fallback price is locked
    } else if (pricing?.locked) {
      return `${name} (${DonationFormHelpers.removeTrailingZeros(
        pricing.currencyValues?.[this.selectedCurrencyId || ""]?.text,
      )})`;
    }

    return name;
  }

  render() {
    //language=HTML
    return html`
      <div class="${this.variation === DonationFormType.Quick ? "n3o-quick-input-container" : ""}">
        <select
          @change="${(e: Event) => {
            const item = this.options.find((opt) =>
              opt.type === "fund"
                ? opt.fund?.donationItem === (e.target as HTMLSelectElement).value
                : opt.sponsorship?.scheme === (e.target as HTMLSelectElement).value,
            );
            this.onChange?.(item);
          }}"
        >
          ${this.options?.length
            ? this.options.map((option) => {
                return html`<option
                  value="${option.type === "fund"
                    ? option.fund?.donationItem
                    : option.sponsorship?.scheme}"
                >
                  ${this.getItemName(option)}
                </option>`;
              })
            : html`<option value="" disabled selected>No funds available</option>`}
        </select>
      </div>
    `;
  }
}
