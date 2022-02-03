import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { DonationOptionRes } from "@n3oltd/umbraco-giving-client/src/index";
import {
  DonationItemRes,
  NamedLookupRes,
  SponsorshipSchemeRes,
} from "@n3oltd/umbraco-giving-client";
import { selectCustomArrowStyles, selectStyles } from "../styles/donationFormStyles";
import { DonationFormType } from "../types";

@customElement("fund-selector")
class FundSelector extends LitElement {
  static styles = [selectStyles, selectCustomArrowStyles];

  @property()
  variation: DonationFormType = DonationFormType.Full;

  @property()
  value?: DonationOptionRes;

  @property()
  onChange?: (option?: DonationOptionRes) => void;

  @property()
  options: DonationOptionRes[] = [];

  @property()
  donationItems: DonationItemRes[] = [];

  @property()
  sponsorshipSchemes: SponsorshipSchemeRes[] = [];

  getDonationItemName(option: DonationOptionRes): string {
    const di = this.donationItems.find((d) => d.id === option.fund?.donationItem);

    const hasFixedPrice = di?.pricing?.locked;
    // TODO: should choose correct currency
    if (this.variation === DonationFormType.Quick && hasFixedPrice)
      return `${di?.name} (${di?.pricing?.amount})`;
    else return di?.name || "";
  }

  getSponsorshipSchemeName(option: DonationOptionRes): string {
    const sp = this.sponsorshipSchemes.find((d) => d.id === option.sponsorship?.scheme);

    // For sponsorships, we can assume for now there is only one mandatory component and just deal with that one.
    // In the future, we'll look at supporting multiple components
    const mandatoryComponent = sp?.components?.find((c) => c.mandatory);
    const hasFixedPrice = mandatoryComponent?.pricing?.locked;
    // TODO: should choose correct currency
    if (this.variation === DonationFormType.Quick && hasFixedPrice)
      return `${mandatoryComponent?.name} (${mandatoryComponent.pricing?.amount})`;
    else return sp?.name || "";
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
                  ${option.type === "fund"
                    ? this.getDonationItemName(option)
                    : this.getSponsorshipSchemeName(option)}
                </option>`;
              })
            : html`<option value="" disabled selected>No funds available</option>`}
        </select>
      </div>
    `;
  }
}
