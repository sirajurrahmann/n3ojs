import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { DonationOptionRes } from "@n3oltd/umbraco-donations-client/src/index";
import {
  DonationItemRes,
  NamedLookupRes,
} from "@n3oltd/umbraco-allocations-client";
import {
  quickInputStyles,
  selectCustomArrowStyles,
  selectStyles,
} from "../styles/donationFormStyles";
import { DonationFormType } from "../types";

@customElement("fund-selector")
class FundSelector extends LitElement {
  static styles = [selectStyles, selectCustomArrowStyles, quickInputStyles];

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
  sponsorshipSchemes: NamedLookupRes[] = [];

  getDonationItemName(option: DonationOptionRes): string {
    const name =
      this.donationItems.find((d) => d.id === option.fund?.donationItem)
        ?.name || "";

    // TODO: Fix this when types updated
    const hasFixedPrice = true;
    if (this.variation === DonationFormType.Quick && hasFixedPrice)
      return `${name} (£30)`;
    else return name;
  }

  getSponsorshipSchemeName(option: DonationOptionRes): string {
    const name =
      this.sponsorshipSchemes.find((d) => d.id === option.sponsorship?.scheme)
        ?.name || "";
    // TODO: Fix this when types updated
    const hasFixedPrice = true;
    if (this.variation === DonationFormType.Quick && hasFixedPrice)
      return `${name} (£30)`;
    else return name;
  }

  render() {
    //language=HTML
    return html`
      <div
        class="${this.variation === DonationFormType.Quick
          ? "n3o-quick-input-container"
          : ""}"
      >
        <select
          @change="${(e: Event) => {
            const item = this.options.find((opt) =>
              opt.type === "fund"
                ? opt.fund?.donationItem ===
                  (e.target as HTMLSelectElement).value
                : opt.sponsorship?.scheme ===
                  (e.target as HTMLSelectElement).value,
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
            : html`<option value="" disabled selected>
                No funds available
              </option>`}
        </select>
      </div>
    `;
  }
}
