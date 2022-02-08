import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { MoneyReq } from "@n3oltd/umbraco-giving-cart-client";
import {
  CurrencyRes,
  GivingClient,
  GivingType,
  SponsorshipDurationRes,
} from "@n3oltd/umbraco-giving-client";
import { selectCustomArrowStyles, selectStyles } from "../styles/donationFormStyles";

@customElement("sponsorship-duration")
class SponsorshipDuration extends LitElement {
  static styles = [selectStyles, selectCustomArrowStyles];

  static quantities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  @property()
  givingType?: GivingType;

  @property()
  currencies: CurrencyRes[] = [];

  @property()
  amount?: MoneyReq;

  @property()
  quantity: number = 1;

  @property()
  theme: string = "";

  @property()
  baseUrl: string = "";

  @property()
  value?: SponsorshipDurationRes;

  @property()
  onChange?: (val?: SponsorshipDurationRes) => void;

  @property()
  onChangeQuantity?: (val?: number) => void;

  @state()
  _durations: SponsorshipDurationRes[] = [];

  getTotal(months?: number): string {
    if (!months) return "";

    const curr = this.currencies.find(
      (c) => this.amount?.currency?.toLowerCase() === c.id?.toLowerCase(),
    );
    return `${curr?.symbol || ""}${((this.amount?.amount || 0) * months).toFixed(2)}`;
  }

  fetchDurations() {
    const client = new GivingClient(this.baseUrl);
    client
      .getLookupSponsorshipDurations()
      .then((res) => {
        this._durations = res;
        this.onChange?.(res[0]); // Setting the first duration by default
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

  renderDonationVersion() {
    // language=html
    return html`
      <div>
        <select
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
              ${this.quantity} * ${duration.name} (${this.getTotal(duration.months)})
            </option>`;
          })}
        </select>
      </div>
    `;
  }

  renderRegularGivingVersion() {
    // language=html
    return html`
      <div>
        <select
          @change="${(e: Event) => {
            this.onChangeQuantity?.(Number((e.target as HTMLSelectElement).value));
          }}"
        >
          ${SponsorshipDuration.quantities?.map((q) => {
            return html`<option .selected="${q === this.quantity}" value="${q}">
              ${q} ${this.theme.toLowerCase()}/month (${this.getTotal(q)})
            </option>`;
          })}
        </select>
      </div>
    `;
  }

  render() {
    if (this.givingType === GivingType.Donation) return this.renderDonationVersion();
    else return this.renderRegularGivingVersion();
  }
}
