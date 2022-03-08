import { html, LitElement, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { MoneyReq } from "@n3oltd/umbraco-giving-cart-client";
import {
  CurrencyRes,
  GivingClient,
  SponsorshipDurationRes,
  SponsorshipSchemeRes,
} from "@n3oltd/umbraco-giving-client";
import { selectCustomArrowStyles, selectStyles, utilStyles } from "../styles/donationFormStyles";
import { DonationFormHelpers } from "../helpers";

@customElement("sponsorship-duration")
class SponsorshipDuration extends LitElement {
  static styles = [
    css`
      :host {
        width: 100%;
      }
    `,
    selectStyles,
    selectCustomArrowStyles,
    utilStyles,
  ];

  @property()
  hideBorder?: boolean;

  @property()
  currencies: CurrencyRes[] = [];

  @property()
  amount?: MoneyReq;

  @property()
  fixedToDefault: boolean = false;

  @property()
  quantity: number = 1;

  @property()
  baseUrl: string = "";

  @property()
  selectedSponsorshipScheme?: SponsorshipSchemeRes;

  @property()
  value?: SponsorshipDurationRes;

  @property()
  onChange?: (val?: SponsorshipDurationRes) => void;

  @state()
  _durations: SponsorshipDurationRes[] = [];

  fetchDurations() {
    const client = new GivingClient(this.baseUrl);
    client
      .getLookupSponsorshipDurations()
      .then((res) => {
        this._durations = res.filter((dur) =>
          this.selectedSponsorshipScheme?.allowedDurations?.find((allowed) => allowed === dur.id),
        );
        if (this.fixedToDefault) {
          this.onChange?.(DonationFormHelpers.getDefaultOrNextBestDuration(this._durations));
        } else {
          this.onChange?.(this._durations[0]); // Setting the first duration by default
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  connectedCallback() {
    super.connectedCallback();

    // Wait till event loop empty
    setTimeout(() => {
      this.fetchDurations();
    });
  }

  render() {
    // language=html
    return html`
      <div>
        <select
          .disabled="${this.fixedToDefault}"
          class="${this.hideBorder ? "n3o-hide-border" : ""}"
          @change="${(e: Event) => {
            this.onChange?.(
              this._durations?.find((d) => d.id === (e.target as HTMLSelectElement).value),
            );
          }}"
        >
          ${this._durations?.map((duration) => {
            return html`<option
              .selected="${duration.id === this.value?.id}"
              value="${duration.id}"
            >
              ${duration.name}
              (${DonationFormHelpers.getAndFormatTotal(
                (duration.months || 0) * this.quantity,
                this.currencies.find(
                  (c) => this.amount?.currency?.toLowerCase() === c.id?.toLowerCase(),
                ),
                this.amount,
              )})
            </option>`;
          })}
        </select>
      </div>
    `;
  }
}
