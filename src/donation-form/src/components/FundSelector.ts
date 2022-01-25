import { html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { DonationOptionRes } from "@n3oltd/umbraco-donations-client/src/index";
import {
  DonationItemRes,
  NamedLookupRes,
} from "@n3oltd/umbraco-allocations-client";
import { selectStyles } from "../styles/donationFormStyles";

@customElement("fund-selector")
class FundSelector extends LitElement {
  static styles = [selectStyles];

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

  getDonationItemName(id: string): string {
    return this.donationItems.find((d) => d.id === id)?.name || "";
  }

  getSponsorshipSchemeName(id: string): string {
    return this.sponsorshipSchemes.find((d) => d.id === id)?.name || "";
  }

  render() {
    //language=HTML
    return html`
      <div class="n3o-donation-form-fund-select">
        <select
          id="fund-select"
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
          ${this.options.map((option) => {
            return html`<option
              @change="${(e: any) => console.log(e)}"
              value="${option.type === "fund"
                ? option.fund?.donationItem
                : option.sponsorship?.scheme}"
            >
              ${option.type === "fund"
                ? this.getDonationItemName(option.fund?.donationItem as string)
                : this.getSponsorshipSchemeName(
                    option.sponsorship?.scheme as string,
                  )}
            </option>`;
          })}
        </select>
      </div>
    `;
  }
}
